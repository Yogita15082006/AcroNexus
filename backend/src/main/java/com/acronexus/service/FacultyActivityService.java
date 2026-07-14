package com.acronexus.service;

import com.acronexus.dto.FacultyActivityRequestDto;
import com.acronexus.dto.FacultyActivityResponseDto;
import java.util.List;
import java.util.UUID;

public interface FacultyActivityService {
    FacultyActivityResponseDto create(FacultyActivityRequestDto requestDto);
    FacultyActivityResponseDto getById(UUID id);
    List<FacultyActivityResponseDto> getAll();
    FacultyActivityResponseDto update(UUID id, FacultyActivityRequestDto requestDto);
    void delete(UUID id);
}
