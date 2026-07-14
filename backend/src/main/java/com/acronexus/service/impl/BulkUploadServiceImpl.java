package com.acronexus.service.impl;

import com.acronexus.dto.BulkUploadRequestDto;
import com.acronexus.dto.BulkUploadResponseDto;
import com.acronexus.entity.BulkUpload;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.BulkUploadMapper;
import com.acronexus.repository.BulkUploadRepository;
import com.acronexus.service.BulkUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BulkUploadServiceImpl implements BulkUploadService {

    private final BulkUploadRepository repository;
    private final BulkUploadMapper mapper;

    @Override
    @Transactional
    public BulkUploadResponseDto create(BulkUploadRequestDto requestDto) {
        BulkUpload entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public BulkUploadResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("BulkUpload not found with id: " + id));
    }

    @Override
    public List<BulkUploadResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BulkUploadResponseDto update(UUID id, BulkUploadRequestDto requestDto) {
        BulkUpload entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BulkUpload not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("BulkUpload not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
