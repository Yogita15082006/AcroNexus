package com.acronexus.mapper;

import com.acronexus.dto.FacultyClassAssignmentRequestDto;
import com.acronexus.dto.FacultyClassAssignmentResponseDto;
import com.acronexus.entity.FacultyClassAssignment;
import org.springframework.stereotype.Component;

@Component
public class FacultyClassAssignmentMapper {
    
    public FacultyClassAssignment toEntity(FacultyClassAssignmentRequestDto dto) {
        if (dto == null) return null;
        FacultyClassAssignment entity = new FacultyClassAssignment();
        // Map fields
        return entity;
    }

    public FacultyClassAssignmentResponseDto toDto(FacultyClassAssignment entity) {
        if (entity == null) return null;
        FacultyClassAssignmentResponseDto dto = new FacultyClassAssignmentResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
