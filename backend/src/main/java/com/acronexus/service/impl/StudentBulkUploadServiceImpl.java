package com.acronexus.service.impl;

import com.acronexus.dto.BulkUploadResponseDto;
import com.acronexus.dto.UploadErrorDto;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.service.StudentBulkUploadService;
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
import java.time.ZonedDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentBulkUploadServiceImpl implements StudentBulkUploadService {

    private final BulkUploadRepository bulkUploadRepository;
    private final FileStorageRepository fileStorageRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SemesterRepository semesterRepository;
    private final AcroClassRepository acroClassRepository;
    private final PasswordEncoder passwordEncoder;
    private final TransactionTemplate transactionTemplate;

    @Override
    public BulkUploadResponseDto uploadStudentList(MultipartFile file, UUID uploadedByUserId) {
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
        bulkUpload.setUploadType(UploadType.STUDENT_LIST);
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

        // Map advanced logs into errorLog jsonb
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

        return buildResponseDto(bulkUpload, stats, fileStorage, processingTimeMs);
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
                    StudentRowData rowData = new StudentRowData(
                            getSafeCsv(record, "Student Name"),
                            getSafeCsv(record, "Enrollment No"),
                            getSafeCsv(record, "College Email"),
                            getSafeCsv(record, "Gender"),
                            getSafeCsv(record, "Batch"),
                            getSafeCsv(record, "Academic Year"),
                            getSafeCsv(record, "Semester"),
                            getSafeCsv(record, "Class"),
                            getSafeCsv(record, "Section"),
                            getSafeCsv(record, "Mobile Number")
                    );
                    executeRowInTransaction(rowNumber, rowData, uploadedBy, stats);
                } catch (Exception e) {
                    stats.failedRecords++;
                    stats.addError(new UploadErrorDto(rowNumber, "N/A", "N/A", "Invalid row data: " + e.getMessage()));
                }
            }
        }
    }

    private String getSafeCsv(CSVRecord record, String header) {
        if (record.isMapped(header)) {
            return record.get(header);
        } else if (record.isMapped(header.toLowerCase())) {
            return record.get(header.toLowerCase());
        }
        return "";
    }

    private void processExcel(MultipartFile file, User uploadedBy, UploadStats stats) throws Exception {
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            Map<String, Integer> headerMap = new HashMap<>();
            if (rows.hasNext()) {
                Row headerRow = rows.next();
                for (Cell cell : headerRow) {
                    headerMap.put(getCellStringValue(cell).toLowerCase(), cell.getColumnIndex());
                }
            }

            int rowNumber = 1;
            while (rows.hasNext()) {
                Row row = rows.next();
                rowNumber++;
                if (isRowEmpty(row)) continue;
                
                stats.totalRecords++;
                try {
                    StudentRowData rowData = new StudentRowData(
                            getSafeExcel(row, headerMap, "Student Name"),
                            getSafeExcel(row, headerMap, "Enrollment No"),
                            getSafeExcel(row, headerMap, "College Email"),
                            getSafeExcel(row, headerMap, "Gender"),
                            getSafeExcel(row, headerMap, "Batch"),
                            getSafeExcel(row, headerMap, "Academic Year"),
                            getSafeExcel(row, headerMap, "Semester"),
                            getSafeExcel(row, headerMap, "Class"),
                            getSafeExcel(row, headerMap, "Section"),
                            getSafeExcel(row, headerMap, "Mobile Number")
                    );
                    executeRowInTransaction(rowNumber, rowData, uploadedBy, stats);
                } catch (Exception e) {
                    stats.failedRecords++;
                    stats.addError(new UploadErrorDto(rowNumber, "N/A", "N/A", "Invalid row data: " + e.getMessage()));
                }
            }
        }
    }
    
    private String getSafeExcel(Row row, Map<String, Integer> headerMap, String headerName) {
        Integer idx = headerMap.get(headerName.toLowerCase());
        if (idx == null) return "";
        return getCellStringValue(row.getCell(idx));
    }

    private void executeRowInTransaction(int rowNumber, StudentRowData data, User uploadedBy, UploadStats stats) {
        transactionTemplate.execute(status -> {
            try {
                processRow(rowNumber, data, uploadedBy, stats);
                return null;
            } catch (Exception e) {
                status.setRollbackOnly(); // Rollback this row only
                stats.failedRecords++;
                stats.addError(new UploadErrorDto(rowNumber, data.enrollmentNo, data.collegeEmail, e.getMessage()));
                return null;
            }
        });
    }

    private void processRow(int rowNumber, StudentRowData data, User uploadedBy, UploadStats stats) {
        if (data.enrollmentNo.isEmpty() || data.collegeEmail.isEmpty()) {
            throw new IllegalArgumentException("Enrollment Number and College Email are strictly required.");
        }
        
        if (data.studentName.isEmpty()) {
            throw new IllegalArgumentException("Student Name is strictly required.");
        }
        
        String[] nameParts = data.studentName.trim().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        if (data.acroClass.isEmpty() || data.section.isEmpty()) {
            throw new IllegalArgumentException("Class and Section are strictly required to resolve Department and Degree.");
        }

        AcroClass acroClass = acroClassRepository.findByNameIgnoreCaseAndSectionIgnoreCase(data.acroClass, data.section)
                .orElseThrow(() -> new IllegalArgumentException("Class '" + data.acroClass + "' with section '" + data.section + "' not found."));

        Department department = acroClass.getDepartment();
        DegreeProgram degreeProgram = acroClass.getDegreeProgram();

        if (department == null || degreeProgram == null) {
            throw new IllegalArgumentException("Found Class but it is missing mapped Department or Degree Program.");
        }

        AcademicYear academicYear = academicYearRepository.findByYear(data.academicYear)
                .orElseThrow(() -> new IllegalArgumentException("Academic Year not found: " + data.academicYear));

        int finalSemNumber;
        try {
            finalSemNumber = (int) Double.parseDouble(data.semester);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid Semester Number: " + data.semester);
        }
        
        Semester semester = semesterRepository.findBySemesterNumberAndAcademicYearId(finalSemNumber, academicYear.getId())
                .orElseThrow(() -> new IllegalArgumentException("Semester not found: " + finalSemNumber + " in year " + data.academicYear));

        boolean isUpdate = false;
        
        // Duplicate Checks
        User user = userRepository.findByEmail(data.collegeEmail).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(data.collegeEmail);
            user.setPasswordHash(passwordEncoder.encode("AcroNexus@123")); // Default password
            user.setRole(UserRole.STUDENT);
            user.setCreatedBy(uploadedBy.getId());
        } else {
            if (user.getRole() != UserRole.STUDENT) {
                throw new IllegalArgumentException("Email already in use by a non-student user.");
            }
            isUpdate = true;
        }

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
                throw new IllegalArgumentException("Invalid gender. Use MALE, FEMALE, or OTHER.");
            }
        }

        user = userRepository.save(user);

        // Student Entity
        Student student = studentRepository.findByEnrollmentNo(data.enrollmentNo).orElse(null);
        if (student != null && !student.getId().equals(user.getId())) {
            throw new IllegalArgumentException("Enrollment Number is already associated with a different email.");
        }
        
        if (student == null) {
            student = new Student();
            student.setId(user.getId());
            student.setUser(user);
        }
        student.setEnrollmentNo(data.enrollmentNo);
        student.setDegreeProgram(degreeProgram);
        student.setBatchYear(data.batchYear);
        student = studentRepository.save(student);

        // Student Enrollment Entity
        StudentEnrollment enrollment = studentEnrollmentRepository
                .findByStudentIdAndAcademicYearIdAndSemesterId(student.getId(), academicYear.getId(), semester.getId())
                .orElse(new StudentEnrollment());
                
        if (enrollment.getId() == null) {
            enrollment.setCreatedBy(uploadedBy);
        } else {
            isUpdate = true; // Mark as update if enrollment existed
        }
        enrollment.setStudent(student);
        enrollment.setAcademicYear(academicYear);
        enrollment.setSemester(semester);
        enrollment.setAcroClass(acroClass);
        studentEnrollmentRepository.save(enrollment);

        stats.successfulRecords++;
        if (isUpdate) {
            stats.updatedRecords++;
            stats.duplicateRecords++; // Record existed, counted as updated/duplicate resolving
        }
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue()).replaceAll("\\.0$", "");
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }

    private BulkUploadResponseDto buildResponseDto(BulkUpload upload, UploadStats stats, FileStorage fileStorage, long processingTimeMs) {
        BulkUploadResponseDto dto = new BulkUploadResponseDto();
        dto.setId(upload.getId());
        dto.setFileName(fileStorage.getFileName());
        dto.setFileType(fileStorage.getFileType());
        
        if (upload.getErrorLog() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> errLog = (Map<String, Object>) upload.getErrorLog();
            if (errLog.containsKey("fileSize")) {
                dto.setFileSize(((Number) errLog.get("fileSize")).longValue());
            }
        }
        
        if (upload.getUploadedBy() != null) {
            dto.setUploadedBy(upload.getUploadedBy().getFirstName() + " " + upload.getUploadedBy().getLastName());
        }
        
        dto.setProcessingTimeMs(processingTimeMs);
        dto.setProcessingStatus(upload.getProcessingStatus());
        dto.setTotalRecords(stats.totalRecords);
        dto.setSuccessfullyInserted(stats.successfulRecords - stats.updatedRecords);
        dto.setUpdatedRecords(stats.updatedRecords);
        dto.setFailedRecords(stats.failedRecords);
        dto.setSkippedRecords(stats.skippedRecords);
        dto.setDuplicateRecords(stats.duplicateRecords);
        dto.setErrorLog(stats.errors);
        dto.setUploadedAt(upload.getUploadedAt());
        dto.setCompletedAt(upload.getCompletedAt());
        return dto;
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
                    .setHeader("Row Number", "Enrollment No", "College Email", "Error Message")
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

    private static class UploadStats {
        int totalRecords = 0;
        int successfulRecords = 0;
        int failedRecords = 0;
        int updatedRecords = 0;
        int skippedRecords = 0;
        int duplicateRecords = 0;
        List<UploadErrorDto> errors = new ArrayList<>();

        void addError(UploadErrorDto error) {
            errors.add(error);
        }
    }

    private record StudentRowData(
            String studentName, String enrollmentNo, String collegeEmail,
            String gender, String batchYear, String academicYear, String semester,
            String acroClass, String section, String mobileNumber
    ) {}
}
