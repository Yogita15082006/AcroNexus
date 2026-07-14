package com.acronexus.service.impl;

import com.acronexus.dto.BulkUploadResponseDto;
import com.acronexus.dto.UploadErrorDto;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.service.ResultBulkUploadService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResultBulkUploadServiceImpl implements ResultBulkUploadService {

    private final BulkUploadRepository bulkUploadRepository;
    private final FileStorageRepository fileStorageRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SemesterRepository semesterRepository;
    private final ExaminationRepository examinationRepository;
    private final ExamResultRepository examResultRepository;
    private final ExamResultsHistoryRepository examResultsHistoryRepository;
    private final TransactionTemplate transactionTemplate;

    @Override
    public BulkUploadResponseDto uploadResultList(MultipartFile file, UUID uploadedByUserId) {
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
        bulkUpload.setUploadType(UploadType.RESULT);
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
                // NOTE (Future Enhancement)
                // Add support for machine-generated PDF Result Sheets.
                // Parse the PDF and route the extracted rows through the same validation and upload pipeline used for Excel/CSV.
                throw new IllegalArgumentException("Unsupported file format. Please upload .csv or Excel files.");
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
                    ResultRowData rowData = new ResultRowData(
                            getSafeCsv(record, "Student Name"),
                            getSafeCsv(record, "Enrollment No"),
                            getSafeCsv(record, "College Email"),
                            getSafeCsv(record, "Branch"),
                            getSafeCsv(record, "Batch"),
                            getSafeCsv(record, "Academic Year"),
                            getSafeCsv(record, "Semester"),
                            getSafeCsv(record, "Class"),
                            getSafeCsv(record, "Subject Code"),
                            getSafeCsv(record, "Subject Name"),
                            getSafeCsv(record, "Exam Type"),
                            getSafeCsv(record, "Max Marks"),
                            getSafeCsv(record, "Obtained Marks")
                    );
                    executeRowInTransaction(rowNumber, rowData, uploadedBy, stats);
                } catch (Exception e) {
                    stats.failedRecords++;
                    stats.addError(new UploadErrorDto(rowNumber, getSafeCsv(record, "Enrollment No"), getSafeCsv(record, "Subject Code"), "Invalid row data: " + e.getMessage()));
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
                    ResultRowData rowData = new ResultRowData(
                            getSafeExcel(row, headerMap, "Student Name"),
                            getSafeExcel(row, headerMap, "Enrollment No"),
                            getSafeExcel(row, headerMap, "College Email"),
                            getSafeExcel(row, headerMap, "Branch"),
                            getSafeExcel(row, headerMap, "Batch"),
                            getSafeExcel(row, headerMap, "Academic Year"),
                            getSafeExcel(row, headerMap, "Semester"),
                            getSafeExcel(row, headerMap, "Class"),
                            getSafeExcel(row, headerMap, "Subject Code"),
                            getSafeExcel(row, headerMap, "Subject Name"),
                            getSafeExcel(row, headerMap, "Exam Type"),
                            getSafeExcel(row, headerMap, "Max Marks"),
                            getSafeExcel(row, headerMap, "Obtained Marks")
                    );
                    executeRowInTransaction(rowNumber, rowData, uploadedBy, stats);
                } catch (Exception e) {
                    stats.failedRecords++;
                    stats.addError(new UploadErrorDto(rowNumber, getSafeExcel(row, headerMap, "Enrollment No"), getSafeExcel(row, headerMap, "Subject Code"), "Invalid row data: " + e.getMessage()));
                }
            }
        }
    }

    private String getSafeExcel(Row row, Map<String, Integer> headerMap, String headerName) {
        Integer idx = headerMap.get(headerName.toLowerCase());
        if (idx == null) return "";
        return getCellStringValue(row.getCell(idx));
    }

    private void executeRowInTransaction(int rowNumber, ResultRowData data, User uploadedBy, UploadStats stats) {
        transactionTemplate.execute(status -> {
            try {
                processRow(rowNumber, data, uploadedBy, stats);
                return null;
            } catch (Exception e) {
                status.setRollbackOnly(); // Rollback this row only
                stats.failedRecords++;
                stats.addError(new UploadErrorDto(rowNumber, data.enrollmentNo, data.subjectCode, e.getMessage()));
                return null;
            }
        });
    }

    private void processRow(int rowNumber, ResultRowData data, User uploadedBy, UploadStats stats) {
        if (data.enrollmentNo.isEmpty()) {
            throw new IllegalArgumentException("Enrollment No is strictly required.");
        }
        if (data.subjectCode.isEmpty()) {
            throw new IllegalArgumentException("Subject Code is strictly required.");
        }
        if (data.academicYear.isEmpty()) {
            throw new IllegalArgumentException("Academic Year is strictly required.");
        }
        if (data.semester.isEmpty()) {
            throw new IllegalArgumentException("Semester is strictly required.");
        }
        if (data.examType.isEmpty()) {
            throw new IllegalArgumentException("Exam Type is strictly required.");
        }
        if (data.marksObtained.isEmpty() || data.maxMarks.isEmpty()) {
            throw new IllegalArgumentException("Obtained Marks and Max Marks are strictly required.");
        }

        Student student = studentRepository.findByEnrollmentNo(data.enrollmentNo)
                .orElseThrow(() -> new IllegalArgumentException("Student with Enrollment No '" + data.enrollmentNo + "' not found."));

        Subject subject = subjectRepository.findByCode(data.subjectCode)
                .orElseThrow(() -> new IllegalArgumentException("Subject with code '" + data.subjectCode + "' not found."));

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

        ExamType type;
        try {
            String rawType = data.examType.toUpperCase().replace(" ", "_");
            // Map "END SEM" or "END_SEM" to whatever the ExamType enum actually has
            // Checking the typical types
            if (rawType.equals("END_SEM") || rawType.equals("END SEM")) {
                rawType = "END_SEM";
            }
            type = ExamType.valueOf(rawType);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid Exam Type: " + data.examType);
        }

        BigDecimal marksObtained, maxMarks;
        try {
            marksObtained = new BigDecimal(data.marksObtained);
            maxMarks = new BigDecimal(data.maxMarks);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Marks Obtained and Maximum Marks must be valid numeric values.");
        }

        Department department = subject.getDepartment();

        Examination examination = examinationRepository.findByDepartmentIdAndSemesterIdAndType(department.getId(), semester.getId(), type)
                .orElseGet(() -> {
                    Examination newExam = new Examination();
                    newExam.setDepartment(department);
                    newExam.setSemester(semester);
                    newExam.setType(type);
                    newExam.setName(academicYear.getYear() + " " + type.name() + " - " + department.getCode());
                    newExam.setStatus(ExamStatus.COMPLETED);
                    return examinationRepository.save(newExam);
                });

        boolean isUpdate = false;
        ExamResult result = examResultRepository.findByExaminationIdAndStudentIdAndSubjectId(examination.getId(), student.getId(), subject.getId())
                .orElse(null);

        if (result == null) {
            result = new ExamResult();
            result.setExamination(examination);
            result.setStudent(student);
            result.setSubject(subject);
        } else {
            isUpdate = true;
            if (result.getMarksObtained().compareTo(marksObtained) != 0) {
                // Record history
                ExamResultsHistory history = new ExamResultsHistory();
                history.setResult(result);
                history.setPreviousMarksObtained(result.getMarksObtained());
                history.setNewMarksObtained(marksObtained);
                history.setModificationReason("Bulk Upload Update");
                history.setModifiedBy(uploadedBy);
                examResultsHistoryRepository.save(history);
            }
        }

        result.setMarksObtained(marksObtained);
        result.setMaxMarks(maxMarks);

        examResultRepository.save(result);

        stats.successfulRecords++;
        if (isUpdate) {
            stats.updatedRecords++;
            stats.duplicateRecords++;
        }
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                yield String.valueOf(cell.getNumericCellValue()).replaceAll("\\.0$", "");
            }
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
                    .setHeader("Row Number", "Enrollment No", "Subject Code", "Error Message")
                    .build();
            try (CSVPrinter printer = new CSVPrinter(new PrintWriter(out), csvFormat)) {
                for (Map<String, Object> err : errors) {
                    printer.printRecord(err.get("rowNumber"), err.get("referenceId"), err.get("emailOrDepartment"), err.get("errorMessage"));
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

    private record ResultRowData(
            String studentName, String enrollmentNo, String collegeEmail, String branch, String batch,
            String academicYear, String semester, String className, String subjectCode, String subjectName,
            String examType, String maxMarks, String marksObtained
    ) {}
}
