package com.acronexus.mapper;

import com.acronexus.dto.StudentAttendanceHistoryRequestDto;
import com.acronexus.dto.StudentAttendanceHistoryResponseDto;
import com.acronexus.entity.StudentAttendanceHistory;
import org.springframework.stereotype.Component;

@Component
public class StudentAttendanceHistoryMapper {
    
    public StudentAttendanceHistory toEntity(StudentAttendanceHistoryRequestDto dto) {
        if (dto == null) return null;
        StudentAttendanceHistory entity = new StudentAttendanceHistory();
        // Map fields
        return entity;
    }

    public StudentAttendanceHistoryResponseDto toDto(StudentAttendanceHistory entity) {
        if (entity == null) return null;
        StudentAttendanceHistoryResponseDto dto = new StudentAttendanceHistoryResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
