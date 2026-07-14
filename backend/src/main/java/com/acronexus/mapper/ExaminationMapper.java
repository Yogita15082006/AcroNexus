package com.acronexus.mapper;

import com.acronexus.dto.ExaminationRequestDto;
import com.acronexus.dto.ExaminationResponseDto;
import com.acronexus.entity.Examination;
import org.springframework.stereotype.Component;

@Component
public class ExaminationMapper {
    
    public Examination toEntity(ExaminationRequestDto dto) {
        if (dto == null) return null;
        Examination entity = new Examination();
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        return entity;
    }

    public ExaminationResponseDto toDto(Examination entity) {
        if (entity == null) return null;
        ExaminationResponseDto dto = new ExaminationResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setType(entity.getType());
        dto.setStatus(entity.getStatus());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getDepartment() != null) {
            dto.setDepartmentId(entity.getDepartment().getId());
            dto.setDepartmentName(entity.getDepartment().getName());
        }

        if (entity.getSemester() != null) {
            dto.setSemesterId(entity.getSemester().getId());
            dto.setSemesterName(String.valueOf(entity.getSemester().getSemesterNumber()));
        }

        return dto;
    }
}
