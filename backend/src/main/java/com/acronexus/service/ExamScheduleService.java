package com.acronexus.service;

import com.acronexus.dto.ExamScheduleRequestDto;
import com.acronexus.dto.ExamScheduleResponseDto;
import java.util.List;
import java.util.UUID;

public interface ExamScheduleService {
    ExamScheduleResponseDto create(ExamScheduleRequestDto requestDto);
    ExamScheduleResponseDto getById(UUID id);
    List<ExamScheduleResponseDto> getAll();
    List<ExamScheduleResponseDto> getByExaminationId(UUID examinationId);
    List<ExamScheduleResponseDto> getUpcoming();
    List<ExamScheduleResponseDto> getPast();
    ExamScheduleResponseDto update(UUID id, ExamScheduleRequestDto requestDto);
    void delete(UUID id);
}
