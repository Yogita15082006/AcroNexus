package com.acronexus.mapper;

import com.acronexus.dto.BulkUploadRequestDto;
import com.acronexus.dto.BulkUploadResponseDto;
import com.acronexus.entity.BulkUpload;
import org.springframework.stereotype.Component;

@Component
public class BulkUploadMapper {
    
    public BulkUpload toEntity(BulkUploadRequestDto dto) {
        if (dto == null) return null;
        BulkUpload entity = new BulkUpload();
        // Map fields
        return entity;
    }

    public BulkUploadResponseDto toDto(BulkUpload entity) {
        if (entity == null) return null;
        BulkUploadResponseDto dto = new BulkUploadResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
