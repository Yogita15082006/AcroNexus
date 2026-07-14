package com.acronexus.mapper;

import com.acronexus.dto.CoordinatorAssignmentRequestDto;
import com.acronexus.dto.CoordinatorAssignmentResponseDto;
import com.acronexus.entity.CoordinatorAssignment;
import org.springframework.stereotype.Component;

@Component
public class CoordinatorAssignmentMapper {
    
    public CoordinatorAssignment toEntity(CoordinatorAssignmentRequestDto dto) {
        if (dto == null) return null;
        CoordinatorAssignment entity = new CoordinatorAssignment();
        // Map fields
        return entity;
    }

    public CoordinatorAssignmentResponseDto toDto(CoordinatorAssignment entity) {
        if (entity == null) return null;
        CoordinatorAssignmentResponseDto dto = new CoordinatorAssignmentResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
