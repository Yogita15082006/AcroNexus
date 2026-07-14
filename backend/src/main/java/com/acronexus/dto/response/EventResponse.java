package com.acronexus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class EventResponse {
    private UUID id;
    private String title;
    private String description;
    private String venue;
    private Instant eventDate;
    private Instant registrationStart;
    private Instant registrationEnd;
    private Integer maxParticipants;
    private Long currentParticipants;
    private Boolean isRegistered;
    private UUID departmentId;
    private String departmentName;
    private UUID targetClassId;
    private String targetClassName;
    private String posterFileUrl;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
