package com.acronexus.service;

import com.acronexus.dto.BulkUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface FacultyBulkUploadService {
    BulkUploadResponseDto uploadFacultyList(MultipartFile file, UUID uploadedByUserId);
    byte[] generateErrorReportCsv(UUID uploadId);
}
