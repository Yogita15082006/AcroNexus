package com.acronexus.dto;

import com.acronexus.entity.ExamStatus;
import com.acronexus.entity.ExamType;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ExaminationResponseDto {
    private UUID id;
    private UUID departmentId;
    private String departmentName;
    private UUID semesterId;
    private String semesterName;
    private String name;
    private ExamType type;
    private ExamStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Instant createdAt;
}
