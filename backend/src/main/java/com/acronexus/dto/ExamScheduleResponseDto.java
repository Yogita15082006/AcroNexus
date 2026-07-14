package com.acronexus.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class ExamScheduleResponseDto {
    private UUID id;
    private UUID examinationId;
    private String examinationName;
    private UUID subjectId;
    private String subjectCode;
    private String subjectName;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String roomNumber;
}
