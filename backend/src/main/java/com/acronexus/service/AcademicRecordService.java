package com.acronexus.service;

import com.acronexus.dto.AcademicRecordRequestDto;
import com.acronexus.dto.AcademicRecordResponseDto;
import java.util.List;
import java.util.UUID;

public interface AcademicRecordService {
    AcademicRecordResponseDto create(AcademicRecordRequestDto requestDto);
    AcademicRecordResponseDto getById(UUID id);
    List<AcademicRecordResponseDto> getAll();
    AcademicRecordResponseDto update(UUID id, AcademicRecordRequestDto requestDto);
    void delete(UUID id);
}
