package com.acronexus.service.impl;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.TimetableVersionDto;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.service.TimetableUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimetableUploadServiceImpl implements TimetableUploadService {

    private final DepartmentRepository departmentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SemesterRepository semesterRepository;
    private final AcroClassRepository acroClassRepository;
    private final TimetableRepository timetableRepository;
    private final FileStorageRepository fileStorageRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/timetables/";

    @Override
    @Transactional
    public ApiResponse<?> uploadTimetable(MultipartFile file, UUID departmentId, UUID academicYearId, UUID semesterId, UUID classId, UUID uploadedBy) {
        // Validate Inputs
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Department ID"));
        AcademicYear academicYear = academicYearRepository.findById(academicYearId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Academic Year ID"));
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Semester ID"));
        AcroClass acroClass = acroClassRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Class ID"));
        User user = userRepository.findById(uploadedBy)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!acroClass.getDepartment().getId().equals(department.getId())) {
            throw new IllegalArgumentException("Class does not belong to the selected department.");
        }

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (!originalFilename.endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are currently supported for Timetable Uploads.");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            // PDF is valid if it loads without throwing an exception
        } catch (IOException e) {
            throw new IllegalArgumentException("Invalid PDF file structure or corrupted file.");
        }

        // Deactivate older versions
        List<Timetable> existingVersions = timetableRepository
                .findByAcroClassAndAcademicYearAndSemester(acroClass, academicYear, semester);

        int nextVersion = 1;
        if (!existingVersions.isEmpty()) {
            nextVersion = existingVersions.stream().mapToInt(Timetable::getVersionNumber).max().orElse(0) + 1;
            for (Timetable t : existingVersions) {
                t.setIsActive(false);
                timetableRepository.save(t);
            }
        }

        // Save File
        FileStorage fileStorage = saveFile(file, user);

        // Create new Timetable version
        Timetable newVersion = new Timetable();
        newVersion.setAcroClass(acroClass);
        newVersion.setAcademicYear(academicYear);
        newVersion.setSemester(semester);
        newVersion.setVersionNumber(nextVersion);
        newVersion.setFile(fileStorage);
        newVersion.setIsActive(true);
        newVersion.setUploadedBy(user);
        
        // TODO (Future Enhancement)
        // Parse timetable PDF.
        // Extract lectures.
        // Detect faculty conflicts.
        // Detect classroom conflicts.
        // Route extracted data through the existing validation pipeline.

        timetableRepository.save(newVersion);

        return ApiResponse.success("Timetable uploaded successfully as Version " + nextVersion, null);
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<?> getVersionHistory(UUID classId, UUID academicYearId, UUID semesterId) {
        List<Timetable> versions = timetableRepository
                .findByAcroClassIdAndAcademicYearIdAndSemesterIdOrderByVersionNumberDesc(
                        classId, academicYearId, semesterId);

        List<TimetableVersionDto> dtoList = versions.stream().map(v -> {
            TimetableVersionDto dto = new TimetableVersionDto();
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
        Timetable version = timetableRepository.findById(versionId)
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
        Timetable version = timetableRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found"));
        if (version.getFile() != null) {
            return version.getFile().getFileName();
        }
        return "timetable.pdf";
    }

    @Override
    @Transactional
    public ApiResponse<?> setActiveVersion(UUID versionId) {
        Timetable versionToActivate = timetableRepository.findById(versionId)
                .orElseThrow(() -> new IllegalArgumentException("Version not found"));

        List<Timetable> allVersions = timetableRepository
                .findByAcroClassAndAcademicYearAndSemester(
                        versionToActivate.getAcroClass(),
                        versionToActivate.getAcademicYear(),
                        versionToActivate.getSemester()
                );

        for (Timetable t : allVersions) {
            boolean isTarget = t.getId().equals(versionToActivate.getId());
            t.setIsActive(isTarget);
            timetableRepository.save(t);

            if (isTarget && t.getFile() != null && Boolean.TRUE.equals(t.getFile().getIsDeleted())) {
                t.getFile().setIsDeleted(false);
                fileStorageRepository.save(t.getFile());
            }
        }

        return ApiResponse.success("Version " + versionToActivate.getVersionNumber() + " is now active", null);
    }

    @Override
    @Transactional
    public ApiResponse<?> softDeleteVersion(UUID versionId) {
        Timetable version = timetableRepository.findById(versionId)
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
