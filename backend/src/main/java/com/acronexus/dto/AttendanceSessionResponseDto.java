package com.acronexus.dto;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AttendanceSessionResponseDto {
    private UUID sessionId;
    private String attendanceCode;
    private java.time.Instant expiresAt;
}
