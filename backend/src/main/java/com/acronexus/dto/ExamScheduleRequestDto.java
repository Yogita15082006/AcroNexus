package com.acronexus.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class ExamScheduleRequestDto {

    @NotNull(message = "Examination ID is required")
    private UUID examinationId;

    @NotNull(message = "Subject ID is required")
    private UUID subjectId;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;
}
