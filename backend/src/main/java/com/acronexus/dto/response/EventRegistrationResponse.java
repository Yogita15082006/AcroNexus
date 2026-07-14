package com.acronexus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class EventRegistrationResponse {
    private UUID id;
    private UUID eventId;
    private String eventTitle;
    private UUID studentId;
    private String studentName;
    private String enrollmentNo;
    private Instant registeredAt;
    private String attendanceStatus;
    private Boolean certificateGenerated;
}
