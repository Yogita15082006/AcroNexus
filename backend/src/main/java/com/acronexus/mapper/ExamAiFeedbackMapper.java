package com.acronexus.mapper;

import com.acronexus.dto.ExamAiFeedbackRequestDto;
import com.acronexus.dto.ExamAiFeedbackResponseDto;
import com.acronexus.entity.ExamAiFeedback;
import org.springframework.stereotype.Component;

@Component
public class ExamAiFeedbackMapper {
    
    public ExamAiFeedback toEntity(ExamAiFeedbackRequestDto dto) {
        if (dto == null) return null;
        ExamAiFeedback entity = new ExamAiFeedback();
        // Map fields
        return entity;
    }

    public ExamAiFeedbackResponseDto toDto(ExamAiFeedback entity) {
        if (entity == null) return null;
        ExamAiFeedbackResponseDto dto = new ExamAiFeedbackResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
