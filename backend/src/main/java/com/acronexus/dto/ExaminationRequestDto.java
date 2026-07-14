package com.acronexus.dto;

import com.acronexus.entity.ExamType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ExaminationRequestDto {
    
    @NotNull(message = "Department ID is required")
    private UUID departmentId;

    @NotNull(message = "Semester ID is required")
    private UUID semesterId;

    @NotBlank(message = "Examination name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Examination type is required")
    private ExamType type;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}
