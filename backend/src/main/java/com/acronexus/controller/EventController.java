package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.request.EventRequest;
import com.acronexus.dto.response.EventRegistrationResponse;
import com.acronexus.dto.response.EventResponse;
import com.acronexus.dto.response.ParticipantExportDto;
import com.acronexus.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.acronexus.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.createEvent(request, currentUser.getId()));
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable UUID eventId,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, request, currentUser.getId()));
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.deleteEvent(eventId, currentUser.getId()));
    }

    @PatchMapping("/{eventId}/toggle-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<EventResponse>> toggleEventStatus(
            @PathVariable UUID eventId,
            @RequestParam boolean isActive,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.toggleEventPublishStatus(eventId, isActive, currentUser.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<Page<EventResponse>>> getAllEvents(
            Pageable pageable,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.getAllEvents(pageable, currentUser.getId()));
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.getEventById(eventId, currentUser.getId()));
    }

    // Student endpoints

    @GetMapping("/available")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAvailableEvents(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.getAvailableEventsForStudent(currentUser.getId()));
    }

    @GetMapping("/my-registrations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<EventRegistrationResponse>>> getMyRegistrations(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.getStudentRegistrations(currentUser.getId()));
    }

    @PostMapping("/{eventId}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<EventRegistrationResponse>> registerForEvent(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.registerForEvent(eventId, currentUser.getId()));
    }

    @DeleteMapping("/{eventId}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Void>> cancelRegistration(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.cancelRegistration(eventId, currentUser.getId()));
    }

    // Admin/Faculty registration management endpoints

    @GetMapping("/{eventId}/registrations")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<Page<EventRegistrationResponse>>> getEventRegistrations(
            @PathVariable UUID eventId,
            Pageable pageable,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.getEventRegistrations(eventId, pageable, currentUser.getId()));
    }

    @GetMapping("/{eventId}/export-participants")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'FACULTY')")
    public ResponseEntity<ApiResponse<List<ParticipantExportDto>>> exportParticipants(
            @PathVariable UUID eventId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        return ResponseEntity.ok(eventService.exportParticipantList(eventId, currentUser.getId()));
    }
}
