package com.acronexus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ParticipantExportDto {
    private String enrollmentNo;
    private String studentName;
    private String studentEmail;
    private Instant registeredAt;
    private String attendanceStatus;
}
