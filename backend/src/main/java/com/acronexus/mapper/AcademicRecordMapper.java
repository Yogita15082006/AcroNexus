package com.acronexus.mapper;

import com.acronexus.dto.AcademicRecordRequestDto;
import com.acronexus.dto.AcademicRecordResponseDto;
import com.acronexus.entity.AcademicRecord;
import org.springframework.stereotype.Component;

@Component
public class AcademicRecordMapper {
    
    public AcademicRecord toEntity(AcademicRecordRequestDto dto) {
        if (dto == null) return null;
        AcademicRecord entity = new AcademicRecord();
        // Map fields
        return entity;
    }

    public AcademicRecordResponseDto toDto(AcademicRecord entity) {
        if (entity == null) return null;
        AcademicRecordResponseDto dto = new AcademicRecordResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
