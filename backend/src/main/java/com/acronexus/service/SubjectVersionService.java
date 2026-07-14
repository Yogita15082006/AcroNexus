package com.acronexus.service;

import com.acronexus.dto.SubjectVersionRequestDto;
import com.acronexus.dto.SubjectVersionResponseDto;
import java.util.List;
import java.util.UUID;

public interface SubjectVersionService {
    SubjectVersionResponseDto create(SubjectVersionRequestDto requestDto);
    SubjectVersionResponseDto getById(UUID id);
    List<SubjectVersionResponseDto> getAll();
    SubjectVersionResponseDto update(UUID id, SubjectVersionRequestDto requestDto);
    void delete(UUID id);
}
