package com.acronexus.service;

import com.acronexus.dto.ApiResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;


public interface SubjectResourceUploadService {
    ApiResponse<?> uploadResource(MultipartFile file, UUID departmentId, UUID academicYearId, UUID semesterId, UUID subjectId, String resourceType, UUID uploadedBy);
    
    ApiResponse<?> getVersionHistory(UUID subjectId, UUID academicYearId, UUID semesterId, String resourceType);
    
    byte[] downloadVersion(UUID versionId);
    String getFileName(UUID versionId);
    
    ApiResponse<?> setActiveVersion(UUID versionId);
    
    ApiResponse<?> softDeleteVersion(UUID versionId);
}
