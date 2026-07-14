package com.acronexus.service;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.AttendanceSessionRequestDto;
import com.acronexus.dto.AttendanceSessionResponseDto;
import com.acronexus.dto.AttendanceSubmitRequestDto;
import java.util.UUID;

public interface AttendanceService {
    ApiResponse<AttendanceSessionResponseDto> createSession(AttendanceSessionRequestDto request, UUID facultyId);
    ApiResponse<String> submitAttendance(AttendanceSubmitRequestDto request, UUID studentId);
    ApiResponse<AttendanceSessionResponseDto> getSession(UUID sessionId);
    ApiResponse<String> closeSession(UUID sessionId, UUID facultyId);
}
