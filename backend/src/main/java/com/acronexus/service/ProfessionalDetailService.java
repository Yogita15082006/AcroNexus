package com.acronexus.service;

import com.acronexus.dto.ProfessionalDetailRequestDto;
import com.acronexus.dto.ProfessionalDetailResponseDto;
import java.util.List;
import java.util.UUID;

public interface ProfessionalDetailService {
    ProfessionalDetailResponseDto create(ProfessionalDetailRequestDto requestDto);
    ProfessionalDetailResponseDto getById(UUID id);
    List<ProfessionalDetailResponseDto> getAll();
    ProfessionalDetailResponseDto update(UUID id, ProfessionalDetailRequestDto requestDto);
    void delete(UUID id);
}
