package com.acronexus.service.impl;

import com.acronexus.dto.SubjectVersionRequestDto;
import com.acronexus.dto.SubjectVersionResponseDto;
import com.acronexus.entity.SubjectVersion;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.SubjectVersionMapper;
import com.acronexus.repository.SubjectVersionRepository;
import com.acronexus.service.SubjectVersionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectVersionServiceImpl implements SubjectVersionService {

    private final SubjectVersionRepository repository;
    private final SubjectVersionMapper mapper;

    @Override
    @Transactional
    public SubjectVersionResponseDto create(SubjectVersionRequestDto requestDto) {
        SubjectVersion entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public SubjectVersionResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("SubjectVersion not found with id: " + id));
    }

    @Override
    public List<SubjectVersionResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubjectVersionResponseDto update(UUID id, SubjectVersionRequestDto requestDto) {
        SubjectVersion entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SubjectVersion not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("SubjectVersion not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
