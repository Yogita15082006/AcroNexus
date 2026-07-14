package com.acronexus.dto;

import com.acronexus.entity.NoticePriority;
import com.acronexus.entity.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class NoticeRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Notice Type/Category is required")
    private String category;
    
    @NotNull(message = "Priority is required")
    private NoticePriority priority;
    
    private UUID fileId;
    
    private ZonedDateTime publishDate;
    
    // As per schema constraints, expiryDate, academicYearId, semesterId, and section cannot be persisted.
    // They are included here to satisfy API payload requirements and basic validation.
    private ZonedDateTime expiryDate; 
    private UUID departmentId;
    private UUID academicYearId;
    private UUID semesterId;
    private UUID classId;
    private String section;
    
    private UserRole targetRole;
}
