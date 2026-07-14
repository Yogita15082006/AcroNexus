package com.acronexus.service;

import com.acronexus.dto.FacultyClassAssignmentRequestDto;
import com.acronexus.dto.FacultyClassAssignmentResponseDto;
import java.util.List;
import java.util.UUID;

public interface FacultyClassAssignmentService {
    FacultyClassAssignmentResponseDto create(FacultyClassAssignmentRequestDto requestDto);
    FacultyClassAssignmentResponseDto getById(UUID id);
    List<FacultyClassAssignmentResponseDto> getAll();
    FacultyClassAssignmentResponseDto update(UUID id, FacultyClassAssignmentRequestDto requestDto);
    void delete(UUID id);
}
