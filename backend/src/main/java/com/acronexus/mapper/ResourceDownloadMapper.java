package com.acronexus.mapper;

import com.acronexus.dto.ResourceDownloadRequestDto;
import com.acronexus.dto.ResourceDownloadResponseDto;
import com.acronexus.entity.ResourceDownload;
import org.springframework.stereotype.Component;

@Component
public class ResourceDownloadMapper {
    
    public ResourceDownload toEntity(ResourceDownloadRequestDto dto) {
        if (dto == null) return null;
        ResourceDownload entity = new ResourceDownload();
        // Map fields
        return entity;
    }

    public ResourceDownloadResponseDto toDto(ResourceDownload entity) {
        if (entity == null) return null;
        ResourceDownloadResponseDto dto = new ResourceDownloadResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
