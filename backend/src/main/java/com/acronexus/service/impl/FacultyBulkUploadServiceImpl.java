package com.acronexus.service.impl;

import com.acronexus.dto.BulkUploadResponseDto;
import com.acronexus.dto.UploadErrorDto;
import com.acronexus.dto.UploadStats;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.service.FacultyBulkUploadService;
import com.acronexus.util.BulkUploadUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class FacultyBulkUploadServiceImpl implements FacultyBulkUploadService {

    private final BulkUploadRepository bulkUploadRepository;
    private final FileStorageRepository fileStorageRepository;
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionTemplate transactionTemplate;

    @Override
    public BulkUploadResponseDto uploadFacultyList(MultipartFile file, UUID uploadedByUserId) {
        Instant startTime = Instant.now();
        User uploadedBy = userRepository.findById(uploadedByUserId)
                .orElseThrow(() -> new IllegalArgumentException("Uploader not found"));

        // Create FileStorage entry
        FileStorage fileStorage = new FileStorage();
        fileStorage.setFileName(file.getOriginalFilename());
        fileStorage.setFileType(file.getContentType());
        fileStorage.setDocumentUrl("local-storage://" + UUID.randomUUID() + "-" + file.getOriginalFilename());
        fileStorage.setUploadedBy(uploadedBy);
        fileStorage.setUploadedAt(ZonedDateTime.now());
        fileStorage = fileStorageRepository.save(fileStorage);

        // Create BulkUpload entry
        BulkUpload bulkUpload = new BulkUpload();
        bulkUpload.setUploadType(UploadType.FACULTY_LIST);
        bulkUpload.setFile(fileStorage);
        bulkUpload.setProcessingStatus(ProcessingStatus.PROCESSING);
        bulkUpload.setUploadedBy(uploadedBy);
        bulkUpload = bulkUploadRepository.save(bulkUpload);

        UploadStats stats = new UploadStats();

        // Process file
        try {
            String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
            if (filename.endsWith(".csv")) {
                processCsv(file, uploadedBy, stats);
            } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
                processExcel(file, uploadedBy, stats);
            } else {
                throw new IllegalArgumentException("Unsupported file format. Please upload .csv or .xlsx files.");
            }

            if (stats.failedRecords > 0 && stats.successfulRecords > 0) {
                bulkUpload.setProcessingStatus(ProcessingStatus.PARTIAL_SUCCESS);
            } else if (stats.failedRecords > 0 && stats.successfulRecords == 0) {
                bulkUpload.setProcessingStatus(ProcessingStatus.FAILED);
            } else {
                bulkUpload.setProcessingStatus(ProcessingStatus.COMPLETED);
            }
        } catch (Exception e) {
            log.error("Bulk upload processing failed completely", e);
            bulkUpload.setProcessingStatus(ProcessingStatus.FAILED);
            stats.addError(new UploadErrorDto(0, "N/A", "N/A", "Fatal error processing file: " + e.getMessage()));
        }

        bulkUpload.setTotalRecords(stats.totalRecords);
        bulkUpload.setSuccessfulRecords(stats.successfulRecords);
        bulkUpload.setFailedRecords(stats.failedRecords);
        bulkUpload.setCompletedAt(Instant.now());

        Map<String, Object> errorLogData = new HashMap<>();
        errorLogData.put("updatedRecords", stats.updatedRecords);
        errorLogData.put("skippedRecords", stats.skippedRecords);
        errorLogData.put("duplicateRecords", stats.duplicateRecords);
        errorLogData.put("validationErrors", stats.errors);
        
        long processingTimeMs = Duration.between(startTime, bulkUpload.getCompletedAt()).toMillis();
        errorLogData.put("processingTimeMs", processingTimeMs);
        errorLogData.put("fileSize", file.getSize());
        
        bulkUpload.setErrorLog(errorLogData);
        bulkUpload = bulkUploadRepository.save(bulkUpload);

        return BulkUploadUtils.buildResponseDto(bulkUpload, stats, fileStorage, processingTimeMs);
    }

    private void processCsv(MultipartFile file, User uploadedBy, UploadStats stats) throws Exception {
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreHeaderCase(true)
                .setTrim(true)
                .build();
        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser csvParser = new CSVParser(reader, csvFormat)) {
            
            int rowNumber = 1;
            for (CSVRecord record : csvParser) {
                rowNumber++;
                stats.totalRecords++;
                try {
                    FacultyRowData rowData = new FacultyRowData(
                            BulkUploadUtils.getSafeCsv(record, "Faculty Name"),
                            BulkUploadUtils.getSafeCsv(record, "Employee ID"),
                            BulkUploadUtils.getSafeCsv(record, "College Email"),
                            BulkUploadUtils.getSafeCsv(record, "Gender"),
                            BulkUploadUtils.getSafeCsv(record, "Role"),
                            BulkUploadUtils.getSafeCsv(record, "Department"),
                            BulkUploadUtils.getSafeCsv(record, "Mobile Number"),
                            BulkUploadUtils.getSafeCsv(record, "Joining Date"),
                            BulkUploadUtils.getSafeCsv(record, "Qualification"),
                            BulkUploadUtils.getSafeCsv(record, "Experience")
                    );
                    executeRowInTransaction(rowNumber, rowData, uploadedBy, stats);
                } catch (Exception e) {
                    stats.failedRecords++;
                    stats.addError(new UploadErrorDto(rowNumber, "N/A", "N/A", "Invalid row data: " + e.getMessage()));
                }
            }
        }
    }

    private void processExcel(MultipartFile file, User uploadedBy, UploadStats stats) throws Exception {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            Map<String, Integer> headerMap = new HashMap<>();
            if (rows.hasNext()) {
                Row headerRow = rows.next();
                for (Cell cell : headerRow) {
                    headerMap.put(BulkUploadUtils.getCellStringValue(cell).toLowerCase(), cell.getColumnIndex());
                }
            }

            int rowNumber = 1;
            while (rows.hasNext()) {
                Row row = rows.next();
                rowNumber++;
                if (BulkUploadUtils.isRowEmpty(row)) continue;
                
                stats.totalRecords++;
                try {
                    FacultyRowData rowData = new FacultyRowData(
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Faculty Name"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Employee ID"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "College Email"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Gender"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Role"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Department"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Mobile Number"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Joining Date"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Qualification"),
                            BulkUploadUtils.getSafeExcel(row, headerMap, "Experience")
                    );
                    executeRowInTransaction(rowNumber, rowData, uploadedBy, stats);
                } catch (Exception e) {
                    stats.failedRecords++;
                    stats.addError(new UploadErrorDto(rowNumber, "N/A", "N/A", "Invalid row data: " + e.getMessage()));
                }
            }
        }
    }
    
    private void executeRowInTransaction(int rowNumber, FacultyRowData data, User uploadedBy, UploadStats stats) {
        transactionTemplate.execute(status -> {
            try {
                processRow(rowNumber, data, uploadedBy, stats);
                return null;
            } catch (Exception e) {
                status.setRollbackOnly();
                stats.failedRecords++;
                stats.addError(new UploadErrorDto(rowNumber, data.employeeId, data.collegeEmail, e.getMessage()));
                return null;
            }
        });
    }

    private void processRow(int rowNumber, FacultyRowData data, User uploadedBy, UploadStats stats) {
        if (data.employeeId.isEmpty() || data.collegeEmail.isEmpty()) {
            throw new IllegalArgumentException("Employee ID and College Email are strictly required.");
        }
        
        if (data.facultyName.isEmpty()) {
            throw new IllegalArgumentException("Faculty Name is strictly required.");
        }
        
        if (data.department.isEmpty()) {
            throw new IllegalArgumentException("Department is strictly required.");
        }
        
        if (data.role.isEmpty()) {
            throw new IllegalArgumentException("Role is strictly required.");
        }
        
        String[] nameParts = data.facultyName.trim().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        Department department = departmentRepository.findByNameIgnoreCase(data.department)
                .orElseThrow(() -> new IllegalArgumentException("Department '" + data.department + "' not found."));

        UserRole role;
        try {
            role = UserRole.valueOf(data.role.toUpperCase());
            if (role == UserRole.STUDENT) {
                throw new IllegalArgumentException("Role cannot be STUDENT for Faculty bulk upload.");
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role. Allowed values: HOD, COORDINATOR, FACULTY.");
        }

        boolean isUpdate = false;
        
        // Duplicate Checks for Email
        User user = userRepository.findByEmail(data.collegeEmail).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(data.collegeEmail);
            user.setPasswordHash(passwordEncoder.encode("AcroNexus@123")); // Default password
            user.setCreatedBy(uploadedBy.getId());
        } else {
            if (user.getRole() == UserRole.STUDENT) {
                throw new IllegalArgumentException("Email already in use by a STUDENT user.");
            }
            isUpdate = true;
        }

        user.setRole(role);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setDepartment(department);
        user.setUpdatedBy(uploadedBy.getId());
        
        if (data.mobileNumber != null && !data.mobileNumber.isEmpty()) {
            user.setPhone(data.mobileNumber);
        }
        
        if (data.gender != null && !data.gender.isEmpty()) {
            try {
                user.setGender(Gender.valueOf(data.gender.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid gender. Allowed values: MALE, FEMALE, OTHER.");
            }
        } else {
            throw new IllegalArgumentException("Gender is strictly required.");
        }

        user = userRepository.save(user);

        // Faculty Entity
        Faculty faculty = facultyRepository.findByEmployeeId(data.employeeId).orElse(null);
        if (faculty != null && !faculty.getId().equals(user.getId())) {
            throw new IllegalArgumentException("Employee ID is already associated with a different email/user.");
        }
        
        if (faculty == null) {
            faculty = facultyRepository.findById(user.getId()).orElse(null);
        }
        
        if (faculty == null) {
            faculty = new Faculty();
            faculty.setId(user.getId());
            faculty.setUser(user);
        }
        
        faculty.setEmployeeId(data.employeeId);
        
        if (data.qualification != null && !data.qualification.isEmpty()) {
            faculty.setQualification(data.qualification);
        }
        
        if (data.experience != null && !data.experience.isEmpty()) {
            try {
                faculty.setExperienceYears(Integer.parseInt(data.experience));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Experience must be a valid numeric value.");
            }
        }
        
        if (data.joiningDate != null && !data.joiningDate.isEmpty()) {
            try {
                // Support multiple typical formats or simply ISO date
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("[yyyy-MM-dd][dd-MM-yyyy][MM/dd/yyyy][dd/MM/yyyy]");
                faculty.setJoiningDate(LocalDate.parse(data.joiningDate, formatter));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid Joining Date format. Please use yyyy-MM-dd.");
            }
        }

        facultyRepository.save(faculty);

        stats.successfulRecords++;
        if (isUpdate) {
            stats.updatedRecords++;
            stats.duplicateRecords++;
        }
    }

    @Override
    public byte[] generateErrorReportCsv(UUID uploadId) {
        BulkUpload upload = bulkUploadRepository.findById(uploadId)
                .orElseThrow(() -> new IllegalArgumentException("Upload not found"));

        Object errorLog = upload.getErrorLog();
        if (errorLog == null) {
            return new byte[0];
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<String, Object> logMap = mapper.convertValue(errorLog, new com.fasterxml.jackson.core.type.TypeReference<>() {});
            Object valErrorsObj = logMap.get("validationErrors");
            if (valErrorsObj == null) {
                return new byte[0];
            }
            
            List<Map<String, Object>> errors = mapper.convertValue(valErrorsObj, new com.fasterxml.jackson.core.type.TypeReference<>() {});

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                    .setHeader("Row Number", "Employee ID", "College Email", "Error Message")
                    .build();
            try (CSVPrinter printer = new CSVPrinter(new PrintWriter(out), csvFormat)) {
                for (Map<String, Object> err : errors) {
                    printer.printRecord(err.get("rowNumber"), err.get("enrollmentNo"), err.get("collegeEmail"), err.get("errorMessage"));
                }
            }
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate error report CSV for upload {}", uploadId, e);
            throw new RuntimeException("Failed to generate error report", e);
        }
    }

    private static class FacultyRowData {
        String facultyName;
        String employeeId;
        String collegeEmail;
        String gender;
        String role;
        String department;
        String mobileNumber;
        String joiningDate;
        String qualification;
        String experience;

        public FacultyRowData(String facultyName, String employeeId, String collegeEmail, String gender, String role, 
                              String department, String mobileNumber, String joiningDate, String qualification, String experience) {
            this.facultyName = facultyName != null ? facultyName.trim() : "";
            this.employeeId = employeeId != null ? employeeId.trim() : "";
            this.collegeEmail = collegeEmail != null ? collegeEmail.trim() : "";
            this.gender = gender != null ? gender.trim() : "";
            this.role = role != null ? role.trim() : "";
            this.department = department != null ? department.trim() : "";
            this.mobileNumber = mobileNumber != null ? mobileNumber.trim() : "";
            this.joiningDate = joiningDate != null ? joiningDate.trim() : "";
            this.qualification = qualification != null ? qualification.trim() : "";
            this.experience = experience != null ? experience.trim() : "";
        }
    }
}
