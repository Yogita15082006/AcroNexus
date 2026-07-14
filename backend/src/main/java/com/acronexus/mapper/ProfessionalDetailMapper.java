package com.acronexus.mapper;

import com.acronexus.dto.ProfessionalDetailRequestDto;
import com.acronexus.dto.ProfessionalDetailResponseDto;
import com.acronexus.entity.ProfessionalDetail;
import org.springframework.stereotype.Component;

@Component
public class ProfessionalDetailMapper {
    
    public ProfessionalDetail toEntity(ProfessionalDetailRequestDto dto) {
        if (dto == null) return null;
        ProfessionalDetail entity = new ProfessionalDetail();
        // Map fields
        return entity;
    }

    public ProfessionalDetailResponseDto toDto(ProfessionalDetail entity) {
        if (entity == null) return null;
        ProfessionalDetailResponseDto dto = new ProfessionalDetailResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
