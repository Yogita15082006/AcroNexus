package com.acronexus.mapper;

import com.acronexus.dto.TimetableRequestDto;
import com.acronexus.dto.TimetableResponseDto;
import com.acronexus.entity.Timetable;
import org.springframework.stereotype.Component;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;

@Component
public class TimetableMapper {
    
    public Timetable toEntity(TimetableRequestDto dto) {
        if (dto == null) return null;
        Timetable entity = new Timetable();
        // Map fields if needed later
        return entity;
    }

    public TimetableResponseDto toDto(Timetable entity) {
        if (entity == null) return null;
        TimetableResponseDto dto = new TimetableResponseDto();
        dto.setId(entity.getId());
        dto.setType("Timetable");
        dto.setVersionNumber(entity.getVersionNumber());
        dto.setIsActive(entity.getIsActive());

        if (entity.getAcroClass() != null) {
            dto.setClassName(entity.getAcroClass().getName() + " " + entity.getAcroClass().getSection());
            dto.setTitle(entity.getAcroClass().getName() + " " + entity.getAcroClass().getSection() + " Timetable V" + entity.getVersionNumber());
        }

        if (entity.getSemester() != null) {
            dto.setSemester("Semester " + entity.getSemester().getSemesterNumber());
        }

        if (entity.getUploadedBy() != null) {
            dto.setUploader(entity.getUploadedBy().getFirstName() + " " + entity.getUploadedBy().getLastName());
        }

        if (entity.getUploadedAt() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            dto.setUpdated(entity.getUploadedAt().atZone(ZoneId.systemDefault()).format(formatter));
        }

        if (entity.getFile() != null) {
            dto.setSize("PDF Document");
        } else {
            dto.setSize("Unknown");
        }

        return dto;
    }
}
