package com.acronexus.service.impl;

import com.acronexus.dto.CoordinatorAssignmentRequestDto;
import com.acronexus.dto.CoordinatorAssignmentResponseDto;
import com.acronexus.entity.CoordinatorAssignment;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.CoordinatorAssignmentMapper;
import com.acronexus.repository.CoordinatorAssignmentRepository;
import com.acronexus.service.CoordinatorAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoordinatorAssignmentServiceImpl implements CoordinatorAssignmentService {

    private final CoordinatorAssignmentRepository repository;
    private final CoordinatorAssignmentMapper mapper;

    @Override
    @Transactional
    public CoordinatorAssignmentResponseDto create(CoordinatorAssignmentRequestDto requestDto) {
        CoordinatorAssignment entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public CoordinatorAssignmentResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("CoordinatorAssignment not found with id: " + id));
    }

    @Override
    public List<CoordinatorAssignmentResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CoordinatorAssignmentResponseDto update(UUID id, CoordinatorAssignmentRequestDto requestDto) {
        CoordinatorAssignment entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CoordinatorAssignment not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("CoordinatorAssignment not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
