package com.acronexus.service;

import com.acronexus.dto.BulkUploadRequestDto;
import com.acronexus.dto.BulkUploadResponseDto;
import java.util.List;
import java.util.UUID;

public interface BulkUploadService {
    BulkUploadResponseDto create(BulkUploadRequestDto requestDto);
    BulkUploadResponseDto getById(UUID id);
    List<BulkUploadResponseDto> getAll();
    BulkUploadResponseDto update(UUID id, BulkUploadRequestDto requestDto);
    void delete(UUID id);
}
