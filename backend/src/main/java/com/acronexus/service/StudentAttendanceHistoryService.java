package com.acronexus.service;

import com.acronexus.dto.StudentAttendanceHistoryRequestDto;
import com.acronexus.dto.StudentAttendanceHistoryResponseDto;
import java.util.List;
import java.util.UUID;

public interface StudentAttendanceHistoryService {
    StudentAttendanceHistoryResponseDto create(StudentAttendanceHistoryRequestDto requestDto);
    StudentAttendanceHistoryResponseDto getById(UUID id);
    List<StudentAttendanceHistoryResponseDto> getAll();
    StudentAttendanceHistoryResponseDto update(UUID id, StudentAttendanceHistoryRequestDto requestDto);
    void delete(UUID id);
}
