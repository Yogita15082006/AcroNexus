package com.acronexus.mapper;

import com.acronexus.dto.NoticeDto;
import com.acronexus.entity.Notice;
import org.springframework.stereotype.Component;

@Component
public class NoticeMapper {

    public NoticeDto toDto(Notice notice) {
        if (notice == null) {
            return null;
        }

        NoticeDto dto = new NoticeDto();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setDescription(notice.getDescription());
        dto.setCategory(notice.getCategory());
        dto.setPriority(notice.getPriority());
        
        if (notice.getFile() != null) {
            dto.setFileId(notice.getFile().getId());
            dto.setFileUrl(notice.getFile().getDocumentUrl());
        }
        
        dto.setPublishDate(notice.getPublishDate());
        
        if (notice.getPublishedBy() != null) {
            dto.setPublishedById(notice.getPublishedBy().getId());
            dto.setPublishedByName(notice.getPublishedBy().getFirstName() + " " + notice.getPublishedBy().getLastName());
        }
        
        if (notice.getTargetDepartment() != null) {
            dto.setTargetDepartmentId(notice.getTargetDepartment().getId());
            dto.setTargetDepartmentName(notice.getTargetDepartment().getName());
        }
        
        if (notice.getTargetClass() != null) {
            dto.setTargetClassId(notice.getTargetClass().getId());
            dto.setTargetClassName(notice.getTargetClass().getName() + 
                (notice.getTargetClass().getSection() != null ? " - " + notice.getTargetClass().getSection() : ""));
        }
        
        dto.setTargetRole(notice.getTargetRole());
        dto.setIsActive(notice.getIsActive());

        return dto;
    }
}
