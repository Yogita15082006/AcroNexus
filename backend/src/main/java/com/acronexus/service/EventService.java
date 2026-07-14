package com.acronexus.service;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.request.EventRequest;
import com.acronexus.dto.response.EventRegistrationResponse;
import com.acronexus.dto.response.EventResponse;
import com.acronexus.dto.response.ParticipantExportDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface EventService {
    ApiResponse<EventResponse> createEvent(EventRequest request, UUID currentUserId);
    ApiResponse<EventResponse> updateEvent(UUID eventId, EventRequest request, UUID currentUserId);
    ApiResponse<Void> deleteEvent(UUID eventId, UUID currentUserId);
    ApiResponse<EventResponse> toggleEventPublishStatus(UUID eventId, boolean isActive, UUID currentUserId);
    
    ApiResponse<Page<EventResponse>> getAllEvents(Pageable pageable, UUID currentUserId);
    ApiResponse<EventResponse> getEventById(UUID eventId, UUID currentUserId);
    
    ApiResponse<List<EventResponse>> getAvailableEventsForStudent(UUID studentUserId);
    ApiResponse<List<EventRegistrationResponse>> getStudentRegistrations(UUID studentUserId);
    
    ApiResponse<EventRegistrationResponse> registerForEvent(UUID eventId, UUID studentUserId);
    ApiResponse<Void> cancelRegistration(UUID eventId, UUID studentUserId);
    
    ApiResponse<Page<EventRegistrationResponse>> getEventRegistrations(UUID eventId, Pageable pageable, UUID currentUserId);
    ApiResponse<List<ParticipantExportDto>> exportParticipantList(UUID eventId, UUID currentUserId);
}
