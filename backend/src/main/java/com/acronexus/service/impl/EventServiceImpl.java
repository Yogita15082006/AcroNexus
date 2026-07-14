package com.acronexus.service.impl;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.request.EventRequest;
import com.acronexus.dto.response.EventRegistrationResponse;
import com.acronexus.dto.response.EventResponse;
import com.acronexus.dto.response.ParticipantExportDto;
import com.acronexus.entity.*;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.EventMapper;
import com.acronexus.repository.*;
import com.acronexus.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final DepartmentRepository departmentRepository;
    private final AcroClassRepository acroClassRepository;
    private final FileStorageRepository fileStorageRepository;
    private final EventMapper eventMapper;

    @Override
    @Transactional
    public ApiResponse<EventResponse> createEvent(EventRequest request, UUID currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == UserRole.STUDENT) {
            throw new RuntimeException("Students cannot create events");
        }

        Event event = eventMapper.toEntity(request);
        event.setCreatedBy(user);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            event.setDepartment(dept);
        } else if (user.getRole() == UserRole.FACULTY || user.getRole() == UserRole.HOD) {
            event.setDepartment(user.getDepartment());
        }

        if (request.getTargetClassId() != null) {
            AcroClass acroClass = acroClassRepository.findById(request.getTargetClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target class not found"));
            event.setTargetClass(acroClass);
        }

        if (request.getPosterFileId() != null) {
            FileStorage file = fileStorageRepository.findById(request.getPosterFileId())
                    .orElseThrow(() -> new ResourceNotFoundException("Poster file not found"));
            event.setPosterFile(file);
        }

        event = eventRepository.save(event);
        return ApiResponse.success("Event created successfully", eventMapper.toResponse(event, 0L, false));
    }

    @Override
    @Transactional
    public ApiResponse<EventResponse> updateEvent(UUID eventId, EventRequest request, UUID currentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
                
        checkEventManagementPermission(event, currentUserId);

        eventMapper.updateEntity(event, request);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            event.setDepartment(dept);
        } else {
            event.setDepartment(null);
        }

        if (request.getTargetClassId() != null) {
            AcroClass acroClass = acroClassRepository.findById(request.getTargetClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Target class not found"));
            event.setTargetClass(acroClass);
        } else {
            event.setTargetClass(null);
        }

        if (request.getPosterFileId() != null) {
            FileStorage file = fileStorageRepository.findById(request.getPosterFileId())
                    .orElseThrow(() -> new ResourceNotFoundException("Poster file not found"));
            event.setPosterFile(file);
        } else {
            event.setPosterFile(null);
        }

        event = eventRepository.save(event);
        long currentParticipants = eventRegistrationRepository.countByEventId(eventId);
        return ApiResponse.success("Event updated successfully", eventMapper.toResponse(event, currentParticipants, false));
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteEvent(UUID eventId, UUID currentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        checkEventManagementPermission(event, currentUserId);
        eventRepository.delete(event);
        return ApiResponse.success("Event deleted successfully", null);
    }

    @Override
    @Transactional
    public ApiResponse<EventResponse> toggleEventPublishStatus(UUID eventId, boolean isActive, UUID currentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        checkEventManagementPermission(event, currentUserId);
        event.setIsActive(isActive);
        event = eventRepository.save(event);
        long currentParticipants = eventRegistrationRepository.countByEventId(eventId);
        return ApiResponse.success("Event status updated", eventMapper.toResponse(event, currentParticipants, false));
    }

    @Override
    public ApiResponse<Page<EventResponse>> getAllEvents(Pageable pageable, UUID currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Page<Event> events = eventRepository.findAllByDepartmentId(user.getDepartment().getId(), pageable);
        
        Page<EventResponse> responsePage = events.map(e -> {
            long count = eventRegistrationRepository.countByEventId(e.getId());
            return eventMapper.toResponse(e, count, false);
        });
        
        return ApiResponse.success("Events fetched successfully", responsePage);
    }

    @Override
    public ApiResponse<EventResponse> getEventById(UUID eventId, UUID currentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        long count = eventRegistrationRepository.countByEventId(eventId);
        boolean isRegistered = false;
        
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == UserRole.STUDENT) {
            isRegistered = eventRegistrationRepository.existsByEventIdAndStudentUserId(eventId, currentUserId);
        }
        
        return ApiResponse.success("Event fetched successfully", eventMapper.toResponse(event, count, isRegistered));
    }

    @Override
    public ApiResponse<List<EventResponse>> getAvailableEventsForStudent(UUID studentUserId) {
        Student student = studentRepository.findByUser_Id(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        StudentEnrollment enrollment = studentEnrollmentRepository
                .findFirstByStudentUserIdAndIsActiveTrueOrderByCreatedAtDesc(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No active enrollment found"));
                
        UUID deptId = student.getUser().getDepartment().getId();
        UUID classId = enrollment.getAcroClass().getId();
        
        List<Event> availableEvents = eventRepository.findAvailableEventsForStudent(deptId, classId, Instant.now());
        
        List<EventResponse> responses = availableEvents.stream().map(e -> {
            long count = eventRegistrationRepository.countByEventId(e.getId());
            boolean isRegistered = eventRegistrationRepository.existsByEventIdAndStudentUserId(e.getId(), studentUserId);
            return eventMapper.toResponse(e, count, isRegistered);
        }).collect(Collectors.toList());
        
        return ApiResponse.success("Available events fetched", responses);
    }

    @Override
    public ApiResponse<List<EventRegistrationResponse>> getStudentRegistrations(UUID studentUserId) {
        List<EventRegistration> registrations = eventRegistrationRepository.findByStudentUserIdOrderByRegisteredAtDesc(studentUserId);
        List<EventRegistrationResponse> responses = registrations.stream()
                .map(eventMapper::toRegistrationResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Registrations fetched", responses);
    }

    @Override
    @Transactional
    public ApiResponse<EventRegistrationResponse> registerForEvent(UUID eventId, UUID studentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
                
        if (!event.getIsActive()) {
            throw new RuntimeException("Event is not active");
        }
        
        Instant now = Instant.now();
        if (event.getRegistrationStart() != null && now.isBefore(event.getRegistrationStart())) {
            throw new RuntimeException("Registration has not started yet");
        }
        if (event.getRegistrationEnd() != null && now.isAfter(event.getRegistrationEnd())) {
            throw new RuntimeException("Registration has closed");
        }
        if (event.getEventDate() != null && now.isAfter(event.getEventDate())) {
            throw new RuntimeException("Cannot register after event date");
        }
        
        if (eventRegistrationRepository.existsByEventIdAndStudentUserId(eventId, studentUserId)) {
            throw new RuntimeException("Student is already registered for this event");
        }
        
        if (event.getMaxParticipants() != null) {
            long currentParticipants = eventRegistrationRepository.countByEventId(eventId);
            if (currentParticipants >= event.getMaxParticipants()) {
                throw new RuntimeException("Event has reached maximum participant capacity");
            }
        }
        
        Student student = studentRepository.findByUser_Id(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                
        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .student(student)
                .build();
                
        registration = eventRegistrationRepository.save(registration);
        return ApiResponse.success("Successfully registered for event", eventMapper.toRegistrationResponse(registration));
    }

    @Override
    @Transactional
    public ApiResponse<Void> cancelRegistration(UUID eventId, UUID studentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
                
        Instant now = Instant.now();
        if (event.getRegistrationEnd() != null && now.isAfter(event.getRegistrationEnd())) {
            throw new RuntimeException("Cannot cancel registration after registration has closed");
        }
        
        EventRegistration registration = eventRegistrationRepository.findByEventIdAndStudentUserId(eventId, studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
                
        eventRegistrationRepository.delete(registration);
        return ApiResponse.success("Registration cancelled successfully", null);
    }

    @Override
    public ApiResponse<Page<EventRegistrationResponse>> getEventRegistrations(UUID eventId, Pageable pageable, UUID currentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        checkEventManagementPermission(event, currentUserId);
        
        Page<EventRegistration> registrations = eventRegistrationRepository.findByEventId(eventId, pageable);
        Page<EventRegistrationResponse> responses = registrations.map(eventMapper::toRegistrationResponse);
        return ApiResponse.success("Registrations fetched", responses);
    }

    @Override
    public ApiResponse<List<ParticipantExportDto>> exportParticipantList(UUID eventId, UUID currentUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        checkEventManagementPermission(event, currentUserId);
        
        List<EventRegistration> registrations = eventRegistrationRepository.findByEventIdOrderByRegisteredAtDesc(eventId);
        List<ParticipantExportDto> dtos = registrations.stream().map(r -> ParticipantExportDto.builder()
                .enrollmentNo(r.getStudent().getEnrollmentNo())
                .studentName(r.getStudent().getUser().getFirstName() + " " + r.getStudent().getUser().getLastName())
                .studentEmail(r.getStudent().getUser().getEmail())
                .registeredAt(r.getRegisteredAt())
                .attendanceStatus(r.getAttendanceStatus())
                .build()
        ).collect(Collectors.toList());
        
        return ApiResponse.success("Export data generated", dtos);
    }
    
    private void checkEventManagementPermission(Event event, UUID currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        if (user.getRole() == UserRole.STUDENT) {
            throw new RuntimeException("Access denied");
        }
        
        if (event.getDepartment() != null && !event.getDepartment().getId().equals(user.getDepartment().getId())) {
            throw new RuntimeException("Cannot manage events of another department");
        }
    }
}
