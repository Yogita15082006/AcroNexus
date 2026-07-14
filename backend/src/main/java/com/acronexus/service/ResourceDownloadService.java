package com.acronexus.service;

import com.acronexus.dto.ResourceDownloadRequestDto;
import com.acronexus.dto.ResourceDownloadResponseDto;
import java.util.List;
import java.util.UUID;

public interface ResourceDownloadService {
    ResourceDownloadResponseDto create(ResourceDownloadRequestDto requestDto);
    ResourceDownloadResponseDto getById(UUID id);
    List<ResourceDownloadResponseDto> getAll();
    ResourceDownloadResponseDto update(UUID id, ResourceDownloadRequestDto requestDto);
    void delete(UUID id);
}
