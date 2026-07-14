package com.acronexus.service;

import com.acronexus.dto.ExaminationRequestDto;
import com.acronexus.dto.ExaminationResponseDto;
import java.util.List;
import java.util.UUID;

public interface ExaminationService {
    ExaminationResponseDto create(ExaminationRequestDto requestDto);
    ExaminationResponseDto getById(UUID id);
    List<ExaminationResponseDto> getAll();
    ExaminationResponseDto update(UUID id, ExaminationRequestDto requestDto);
    void delete(UUID id);
}
