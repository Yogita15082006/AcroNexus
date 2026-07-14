package com.acronexus.service.impl;

import com.acronexus.dto.FacultyClassAssignmentRequestDto;
import com.acronexus.dto.FacultyClassAssignmentResponseDto;
import com.acronexus.entity.FacultyClassAssignment;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.FacultyClassAssignmentMapper;
import com.acronexus.repository.FacultyClassAssignmentRepository;
import com.acronexus.service.FacultyClassAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyClassAssignmentServiceImpl implements FacultyClassAssignmentService {

    private final FacultyClassAssignmentRepository repository;
    private final FacultyClassAssignmentMapper mapper;

    @Override
    @Transactional
    public FacultyClassAssignmentResponseDto create(FacultyClassAssignmentRequestDto requestDto) {
        FacultyClassAssignment entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public FacultyClassAssignmentResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("FacultyClassAssignment not found with id: " + id));
    }

    @Override
    public List<FacultyClassAssignmentResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FacultyClassAssignmentResponseDto update(UUID id, FacultyClassAssignmentRequestDto requestDto) {
        FacultyClassAssignment entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FacultyClassAssignment not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("FacultyClassAssignment not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
