package com.acronexus.mapper;

import com.acronexus.dto.AiMatchRunRequestDto;
import com.acronexus.dto.AiMatchRunResponseDto;
import com.acronexus.entity.AiMatchRun;
import org.springframework.stereotype.Component;

@Component
public class AiMatchRunMapper {
    
    public AiMatchRun toEntity(AiMatchRunRequestDto dto) {
        if (dto == null) return null;
        AiMatchRun entity = new AiMatchRun();
        // Map fields
        return entity;
    }

    public AiMatchRunResponseDto toDto(AiMatchRun entity) {
        if (entity == null) return null;
        AiMatchRunResponseDto dto = new AiMatchRunResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
