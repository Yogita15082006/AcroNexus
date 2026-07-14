package com.acronexus.service;

import com.acronexus.dto.TimetableRequestDto;
import com.acronexus.dto.TimetableResponseDto;
import java.util.List;
import java.util.UUID;

public interface TimetableService {
    TimetableResponseDto create(TimetableRequestDto requestDto);
    TimetableResponseDto getById(UUID id);
    List<TimetableResponseDto> getAll();
    TimetableResponseDto update(UUID id, TimetableRequestDto requestDto);
    void delete(UUID id);
}
