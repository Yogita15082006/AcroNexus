package com.acronexus.service.impl;

import com.acronexus.dto.AiMatchRunRequestDto;
import com.acronexus.dto.AiMatchRunResponseDto;
import com.acronexus.entity.AiMatchRun;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.AiMatchRunMapper;
import com.acronexus.repository.AiMatchRunRepository;
import com.acronexus.service.AiMatchRunService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiMatchRunServiceImpl implements AiMatchRunService {

    private final AiMatchRunRepository repository;
    private final AiMatchRunMapper mapper;

    @Override
    @Transactional
    public AiMatchRunResponseDto create(AiMatchRunRequestDto requestDto) {
        AiMatchRun entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public AiMatchRunResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("AiMatchRun not found with id: " + id));
    }

    @Override
    public List<AiMatchRunResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AiMatchRunResponseDto update(UUID id, AiMatchRunRequestDto requestDto) {
        AiMatchRun entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AiMatchRun not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("AiMatchRun not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
