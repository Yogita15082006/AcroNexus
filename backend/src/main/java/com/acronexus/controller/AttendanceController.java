package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.AttendanceSessionRequestDto;
import com.acronexus.dto.AttendanceSessionResponseDto;
import com.acronexus.dto.AttendanceSubmitRequestDto;
import com.acronexus.security.UserDetailsImpl;
import com.acronexus.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/session")
    @PreAuthorize("hasAnyRole('FACULTY', 'HOD', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<AttendanceSessionResponseDto>> createSession(@Valid @RequestBody AttendanceSessionRequestDto request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ApiResponse<AttendanceSessionResponseDto> response = attendanceService.createSession(request, userDetails.getId());
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> submitAttendance(@Valid @RequestBody AttendanceSubmitRequestDto request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ApiResponse<String> response = attendanceService.submitAttendance(request, userDetails.getId());
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/session/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'HOD', 'COORDINATOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<AttendanceSessionResponseDto>> getSession(@PathVariable UUID id) {
        ApiResponse<AttendanceSessionResponseDto> response = attendanceService.getSession(id);
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/session/{id}/close")
    @PreAuthorize("hasAnyRole('FACULTY', 'HOD', 'COORDINATOR')")
    public ResponseEntity<ApiResponse<String>> closeSession(@PathVariable UUID id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ApiResponse<String> response = attendanceService.closeSession(id, userDetails.getId());
        return response.isSuccess() ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
}
