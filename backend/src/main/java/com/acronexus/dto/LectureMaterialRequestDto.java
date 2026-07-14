package com.acronexus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class LectureMaterialRequestDto {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Class Subject ID is required")
    private UUID classSubjectId;

    private Integer unitNumber;

    @NotNull(message = "File ID is required")
    private UUID fileId;
    
    private Boolean isActive = true;
}
