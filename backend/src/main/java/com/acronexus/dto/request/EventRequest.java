package com.acronexus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class EventRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private String venue;
    @NotNull(message = "Event date is required")
    private Instant eventDate;
    private Instant registrationStart;
    private Instant registrationEnd;
    private Integer maxParticipants;
    private UUID departmentId;
    private UUID targetClassId;
    private UUID posterFileId;
    private Boolean isActive = true;
}
