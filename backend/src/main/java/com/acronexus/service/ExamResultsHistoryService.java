package com.acronexus.service;

import com.acronexus.dto.ExamResultsHistoryRequestDto;
import com.acronexus.dto.ExamResultsHistoryResponseDto;
import java.util.List;
import java.util.UUID;

public interface ExamResultsHistoryService {
    ExamResultsHistoryResponseDto create(ExamResultsHistoryRequestDto requestDto);
    ExamResultsHistoryResponseDto getById(UUID id);
    List<ExamResultsHistoryResponseDto> getAll();
    ExamResultsHistoryResponseDto update(UUID id, ExamResultsHistoryRequestDto requestDto);
    void delete(UUID id);
}
