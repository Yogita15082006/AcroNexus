package com.acronexus.mapper;

import com.acronexus.dto.FacultyActivityRequestDto;
import com.acronexus.dto.FacultyActivityResponseDto;
import com.acronexus.entity.FacultyActivity;
import org.springframework.stereotype.Component;

@Component
public class FacultyActivityMapper {
    
    public FacultyActivity toEntity(FacultyActivityRequestDto dto) {
        if (dto == null) return null;
        FacultyActivity entity = new FacultyActivity();
        // Map fields
        return entity;
    }

    public FacultyActivityResponseDto toDto(FacultyActivity entity) {
        if (entity == null) return null;
        FacultyActivityResponseDto dto = new FacultyActivityResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
