package com.acronexus.mapper;

import com.acronexus.dto.AssignmentSubmissionRequestDto;
import com.acronexus.dto.AssignmentSubmissionResponseDto;
import com.acronexus.entity.AssignmentSubmission;
import org.springframework.stereotype.Component;

@Component
public class AssignmentSubmissionMapper {
    
    public AssignmentSubmission toEntity(AssignmentSubmissionRequestDto dto) {
        if (dto == null) return null;
        AssignmentSubmission entity = new AssignmentSubmission();
        // Map fields
        return entity;
    }

    public AssignmentSubmissionResponseDto toDto(AssignmentSubmission entity) {
        if (entity == null) return null;
        AssignmentSubmissionResponseDto dto = new AssignmentSubmissionResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
