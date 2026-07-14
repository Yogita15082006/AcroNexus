package com.acronexus.service;

import com.acronexus.dto.AssignmentSubmissionRequestDto;
import com.acronexus.dto.AssignmentSubmissionResponseDto;
import java.util.List;
import java.util.UUID;

public interface AssignmentSubmissionService {
    AssignmentSubmissionResponseDto create(AssignmentSubmissionRequestDto requestDto);
    AssignmentSubmissionResponseDto getById(UUID id);
    List<AssignmentSubmissionResponseDto> getAll();
    AssignmentSubmissionResponseDto update(UUID id, AssignmentSubmissionRequestDto requestDto);
    void delete(UUID id);
}
