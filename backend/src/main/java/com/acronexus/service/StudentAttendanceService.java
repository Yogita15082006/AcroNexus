package com.acronexus.service;

import com.acronexus.dto.StudentAttendanceRequestDto;
import com.acronexus.dto.StudentAttendanceResponseDto;
import java.util.List;
import java.util.UUID;

public interface StudentAttendanceService {
    StudentAttendanceResponseDto create(StudentAttendanceRequestDto requestDto);
    StudentAttendanceResponseDto getById(UUID id);
    List<StudentAttendanceResponseDto> getAll();
    StudentAttendanceResponseDto update(UUID id, StudentAttendanceRequestDto requestDto);
    void delete(UUID id);
}
