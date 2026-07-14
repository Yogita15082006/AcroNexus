package com.acronexus.mapper;

import com.acronexus.dto.SubjectVersionRequestDto;
import com.acronexus.dto.SubjectVersionResponseDto;
import com.acronexus.entity.SubjectVersion;
import org.springframework.stereotype.Component;

@Component
public class SubjectVersionMapper {
    
    public SubjectVersion toEntity(SubjectVersionRequestDto dto) {
        if (dto == null) return null;
        SubjectVersion entity = new SubjectVersion();
        // Map fields
        return entity;
    }

    public SubjectVersionResponseDto toDto(SubjectVersion entity) {
        if (entity == null) return null;
        SubjectVersionResponseDto dto = new SubjectVersionResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
