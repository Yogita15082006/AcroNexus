package com.acronexus.mapper;

import com.acronexus.dto.StudentAttendanceRequestDto;
import com.acronexus.dto.StudentAttendanceResponseDto;
import com.acronexus.entity.StudentAttendance;
import org.springframework.stereotype.Component;

@Component
public class StudentAttendanceMapper {
    
    public StudentAttendance toEntity(StudentAttendanceRequestDto dto) {
        if (dto == null) return null;
        StudentAttendance entity = new StudentAttendance();
        // Map fields
        return entity;
    }

    public StudentAttendanceResponseDto toDto(StudentAttendance entity) {
        if (entity == null) return null;
        StudentAttendanceResponseDto dto = new StudentAttendanceResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
