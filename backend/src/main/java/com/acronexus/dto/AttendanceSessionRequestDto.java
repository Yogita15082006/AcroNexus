package com.acronexus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class AttendanceSessionRequestDto {
    @NotNull(message = "Academic Year ID is required")
    private UUID academicYearId;
    @NotNull(message = "Semester ID is required")
    private UUID semesterId;
    @NotNull(message = "Class ID is required")
    private UUID classId;
    @NotNull(message = "Subject ID is required")
    private UUID subjectId;
}
