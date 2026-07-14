package com.acronexus.service.impl;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.SubjectResourceVersionDto;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.service.SubjectResourceUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectResourceUploadServiceImpl implements SubjectResourceUploadService {

    private final DepartmentRepository departmentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SemesterRepository semesterRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectVersionRepository subjectVersionRepository;
    private final FileStorageRepository fileStorageRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/resources/";

    @Override
    @Transactional
    public ApiResponse<?> uploadResource(MultipartFile file, UUID departmentId, UUID academicYearId, UUID semesterId, UUID subjectId, String resourceType, UUID uploadedBy) {
        // Validate Inputs
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Department ID"));
        AcademicYear academicYear = academicYearRepository.findById(academicYearId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Academic Year ID"));
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Semester ID"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Subject ID"));
        User user = userRepository.findById(uploadedBy)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!subject.getDepartment().getId().equals(department.getId())) {
            throw new IllegalArgumentException("Subject does not belong to the selected department.");
        }

        if (!"SCHEME".equalsIgnoreCase(resourceType) && !"SYLLABUS".equalsIgnoreCase(resourceType)) {
            throw new IllegalArgumentException("Invalid resource type. Must be SCHEME or SYLLABUS.");
        }
        
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }
        
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (!originalFilename.endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are currently supported for " + resourceType);
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            // PDF is valid if it loads without throwing an exception
        } catch (IOException e) {
            throw new IllegalArgumentException("Invalid PDF file structure or corrupted file.");
        }

        // Deactivate older versions
        List<SubjectVersion> existingVersions = subjectVersionRepository
                .findBySubjectAndAcademicYearAndSemesterAndResourceType(subject, academicYear, semester, resourceType.toUpperCase());

        int nextVersion = 1;
        if (!existingVersions.isEmpty()) {
            nextVersion = existingVersions.stream().mapToInt(SubjectVersion::getVersionNumber).max().orElse(0) + 1;
            for (SubjectVersion sv : existingVersions) {
                sv.setIsActive(false);
                subjectVersionRepository.save(sv);
            }
        }

        // Save File
        FileStorage fileStorage = saveFile(file, user);

        // Create new SubjectVersion
        SubjectVersion newVersion = new SubjectVersion();
        newVersion.setSubject(subject);
        newVersion.setAcademicYear(academicYear);
        newVersion.setSemester(semester);
        newVersion.setResourceType(resourceType.toUpperCase());
        newVersion.setVersionNumber(nextVersion);
        newVersion.setFile(fileStorage);
        newVersion.setIsActive(true);
        
        // NOTE (Future Enhancement)
        // Add support for AI-based PDF parsing here to automatically extract syllabus units/topics
        // or scheme overview without changing core architecture.
        
        subjectVersionRepository.save(newVersion);

        return ApiResponse.success(resourceType + " uploaded successfully as Version " + nextVersion, null);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<?> getVersionHistory(UUID subjectId, UUID academicYearId, UUID semesterId, String resourceType) {
        List<SubjectVersion> versions = subjectVersionRepository
                .findBySubjectIdAndAcademicYearIdAndSemesterIdAndResourceTypeOrderByVersionNumberDesc(
                        subjectId, academicYearId, semesterId, resourceType.toUpperCase());
        
        List<SubjectResourceVersionDto> dtoList = versions.stream().map(v -> {
            SubjectResourceVersionDto dto = new SubjectResourceVersionDto();
            dto.setId(v.getId());
            dto.setVersionNumber(v.getVersionNumber());
            dto.setIsActive(v.getIsActive());
            if (v.getFile() != null) {
                dto.setFileName(v.getFile().getFileName());
                dto.setFileType(v.getFile().getFileType());
                dto.setUploadedAt(v.getFile().getUploadedAt());
                dto.setIsDeleted(v.getFile().getIsDeleted());
                if (v.getFile().getUploadedBy() != null) {
                    dto.setUploadedBy(v.getFile().getUploadedBy().getFirstName() + " " + v.getFile().getUploadedBy().getLastName());
                }
            }
            return dto;
        }).collect(Collectors.toList());

        return ApiResponse.success("Version history retrieved", dtoList);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadVersion(UUID versionId) {
        SubjectVersion version = subjectVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found"));
        
        if (version.getFile() == null || version.getFile().getDocumentUrl() == null) {
            throw new IllegalArgumentException("File not found for this version");
        }
        
        try {
            Path path = Paths.get(version.getFile().getDocumentUrl());
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new RuntimeException("Error reading file", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getFileName(UUID versionId) {
        SubjectVersion version = subjectVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found"));
        if (version.getFile() != null) {
            return version.getFile().getFileName();
        }
        return "download.pdf";
    }

    @Override
    @Transactional
    public ApiResponse<?> setActiveVersion(UUID versionId) {
        SubjectVersion versionToActivate = subjectVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found"));
        
        List<SubjectVersion> allVersions = subjectVersionRepository
                .findBySubjectAndAcademicYearAndSemesterAndResourceType(
                        versionToActivate.getSubject(),
                        versionToActivate.getAcademicYear(),
                        versionToActivate.getSemester(),
                        versionToActivate.getResourceType()
                );
                
        for (SubjectVersion sv : allVersions) {
            boolean isTarget = sv.getId().equals(versionToActivate.getId());
            sv.setIsActive(isTarget);
            subjectVersionRepository.save(sv);
            
            if (isTarget && sv.getFile() != null && Boolean.TRUE.equals(sv.getFile().getIsDeleted())) {
                sv.getFile().setIsDeleted(false);
                fileStorageRepository.save(sv.getFile());
            }
        }
        
        return ApiResponse.success("Version " + versionToActivate.getVersionNumber() + " is now active", null);
    }

    @Override
    @Transactional
    public ApiResponse<?> softDeleteVersion(UUID versionId) {
        SubjectVersion version = subjectVersionRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found"));
        
        if (Boolean.TRUE.equals(version.getIsActive())) {
            throw new IllegalArgumentException("Cannot delete the active version. Please set another version as active first.");
        }
        
        if (version.getFile() != null) {
            version.getFile().setIsDeleted(true);
            fileStorageRepository.save(version.getFile());
        }
        
        return ApiResponse.success("Version deleted successfully", null);
    }

    private FileStorage saveFile(MultipartFile file, User user) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            FileStorage fs = new FileStorage();
            fs.setFileName(file.getOriginalFilename());
            fs.setDocumentUrl(filePath.toString());
            fs.setFileType(file.getContentType());
            fs.setUploadedBy(user);
            fs.setUploadedAt(ZonedDateTime.now());
            fs.setIsActive(true);
            fs.setIsDeleted(false);
            return fileStorageRepository.save(fs);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
