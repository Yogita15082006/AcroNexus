package com.acronexus.mapper;

import com.acronexus.dto.request.EventRequest;
import com.acronexus.dto.response.EventRegistrationResponse;
import com.acronexus.dto.response.EventResponse;
import com.acronexus.entity.Event;
import com.acronexus.entity.EventRegistration;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public Event toEntity(EventRequest request) {
        return Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .registrationStart(request.getRegistrationStart())
                .registrationEnd(request.getRegistrationEnd())
                .maxParticipants(request.getMaxParticipants())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
    }

    public void updateEntity(Event event, EventRequest request) {
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setRegistrationStart(request.getRegistrationStart());
        event.setRegistrationEnd(request.getRegistrationEnd());
        event.setMaxParticipants(request.getMaxParticipants());
        if (request.getIsActive() != null) {
            event.setIsActive(request.getIsActive());
        }
    }

    public EventResponse toResponse(Event event, long currentParticipants, boolean isRegistered) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .eventDate(event.getEventDate())
                .registrationStart(event.getRegistrationStart())
                .registrationEnd(event.getRegistrationEnd())
                .maxParticipants(event.getMaxParticipants())
                .currentParticipants(currentParticipants)
                .isRegistered(isRegistered)
                .departmentId(event.getDepartment() != null ? event.getDepartment().getId() : null)
                .departmentName(event.getDepartment() != null ? event.getDepartment().getName() : null)
                .targetClassId(event.getTargetClass() != null ? event.getTargetClass().getId() : null)
                .targetClassName(event.getTargetClass() != null ? event.getTargetClass().getName() : null)
                .posterFileUrl(event.getPosterFile() != null ? event.getPosterFile().getDocumentUrl() : null)
                .isActive(event.getIsActive())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    public EventRegistrationResponse toRegistrationResponse(EventRegistration registration) {
        return EventRegistrationResponse.builder()
                .id(registration.getId())
                .eventId(registration.getEvent().getId())
                .eventTitle(registration.getEvent().getTitle())
                .studentId(registration.getStudent().getUser().getId())
                .studentName(registration.getStudent().getUser().getFirstName() + " " + registration.getStudent().getUser().getLastName())
                .enrollmentNo(registration.getStudent().getEnrollmentNo())
                .registeredAt(registration.getRegisteredAt())
                .attendanceStatus(registration.getAttendanceStatus())
                .certificateGenerated(registration.getCertificateGenerated())
                .build();
    }
}
