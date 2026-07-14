package com.acronexus.service.impl;

import com.acronexus.dto.FacultyActivityRequestDto;
import com.acronexus.dto.FacultyActivityResponseDto;
import com.acronexus.entity.FacultyActivity;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.FacultyActivityMapper;
import com.acronexus.repository.FacultyActivityRepository;
import com.acronexus.service.FacultyActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyActivityServiceImpl implements FacultyActivityService {

    private final FacultyActivityRepository repository;
    private final FacultyActivityMapper mapper;

    @Override
    @Transactional
    public FacultyActivityResponseDto create(FacultyActivityRequestDto requestDto) {
        FacultyActivity entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public FacultyActivityResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("FacultyActivity not found with id: " + id));
    }

    @Override
    public List<FacultyActivityResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FacultyActivityResponseDto update(UUID id, FacultyActivityRequestDto requestDto) {
        FacultyActivity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FacultyActivity not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("FacultyActivity not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
