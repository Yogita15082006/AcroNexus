package com.acronexus.service;

import com.acronexus.dto.CoordinatorAssignmentRequestDto;
import com.acronexus.dto.CoordinatorAssignmentResponseDto;
import java.util.List;
import java.util.UUID;

public interface CoordinatorAssignmentService {
    CoordinatorAssignmentResponseDto create(CoordinatorAssignmentRequestDto requestDto);
    CoordinatorAssignmentResponseDto getById(UUID id);
    List<CoordinatorAssignmentResponseDto> getAll();
    CoordinatorAssignmentResponseDto update(UUID id, CoordinatorAssignmentRequestDto requestDto);
    void delete(UUID id);
}
