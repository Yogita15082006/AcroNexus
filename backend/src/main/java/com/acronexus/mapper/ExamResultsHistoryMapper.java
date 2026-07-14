package com.acronexus.mapper;

import com.acronexus.dto.ExamResultsHistoryRequestDto;
import com.acronexus.dto.ExamResultsHistoryResponseDto;
import com.acronexus.entity.ExamResultsHistory;
import org.springframework.stereotype.Component;

@Component
public class ExamResultsHistoryMapper {
    
    public ExamResultsHistory toEntity(ExamResultsHistoryRequestDto dto) {
        if (dto == null) return null;
        ExamResultsHistory entity = new ExamResultsHistory();
        // Map fields
        return entity;
    }

    public ExamResultsHistoryResponseDto toDto(ExamResultsHistory entity) {
        if (entity == null) return null;
        ExamResultsHistoryResponseDto dto = new ExamResultsHistoryResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
