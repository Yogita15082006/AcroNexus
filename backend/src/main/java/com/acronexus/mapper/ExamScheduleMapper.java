package com.acronexus.mapper;

import com.acronexus.dto.ExamScheduleRequestDto;
import com.acronexus.dto.ExamScheduleResponseDto;
import com.acronexus.entity.ExamSchedule;
import org.springframework.stereotype.Component;

@Component
public class ExamScheduleMapper {
    
    public ExamSchedule toEntity(ExamScheduleRequestDto dto) {
        if (dto == null) return null;
        ExamSchedule entity = new ExamSchedule();
        entity.setExamDate(dto.getExamDate());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setRoomNumber(dto.getRoomNumber());
        return entity;
    }

    public ExamScheduleResponseDto toDto(ExamSchedule entity) {
        if (entity == null) return null;
        ExamScheduleResponseDto dto = new ExamScheduleResponseDto();
        dto.setId(entity.getId());
        dto.setExamDate(entity.getExamDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setRoomNumber(entity.getRoomNumber());

        if (entity.getExamination() != null) {
            dto.setExaminationId(entity.getExamination().getId());
            dto.setExaminationName(entity.getExamination().getName());
        }

        if (entity.getSubject() != null) {
            dto.setSubjectId(entity.getSubject().getId());
            dto.setSubjectCode(entity.getSubject().getCode());
            dto.setSubjectName(entity.getSubject().getName());
        }

        return dto;
    }
}
