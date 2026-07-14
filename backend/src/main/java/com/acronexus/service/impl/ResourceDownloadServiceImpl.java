package com.acronexus.service.impl;

import com.acronexus.dto.ResourceDownloadRequestDto;
import com.acronexus.dto.ResourceDownloadResponseDto;
import com.acronexus.entity.ResourceDownload;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.ResourceDownloadMapper;
import com.acronexus.repository.ResourceDownloadRepository;
import com.acronexus.service.ResourceDownloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceDownloadServiceImpl implements ResourceDownloadService {

    private final ResourceDownloadRepository repository;
    private final ResourceDownloadMapper mapper;

    @Override
    @Transactional
    public ResourceDownloadResponseDto create(ResourceDownloadRequestDto requestDto) {
        ResourceDownload entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public ResourceDownloadResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("ResourceDownload not found with id: " + id));
    }

    @Override
    public List<ResourceDownloadResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResourceDownloadResponseDto update(UUID id, ResourceDownloadRequestDto requestDto) {
        ResourceDownload entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResourceDownload not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("ResourceDownload not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
