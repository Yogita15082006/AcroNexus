package com.acronexus.service.impl;

import com.acronexus.dto.AcademicRecordRequestDto;
import com.acronexus.dto.AcademicRecordResponseDto;
import com.acronexus.entity.AcademicRecord;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.AcademicRecordMapper;
import com.acronexus.repository.AcademicRecordRepository;
import com.acronexus.service.AcademicRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicRecordServiceImpl implements AcademicRecordService {

    private final AcademicRecordRepository repository;
    private final AcademicRecordMapper mapper;

    @Override
    @Transactional
    public AcademicRecordResponseDto create(AcademicRecordRequestDto requestDto) {
        AcademicRecord entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public AcademicRecordResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicRecord not found with id: " + id));
    }

    @Override
    public List<AcademicRecordResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AcademicRecordResponseDto update(UUID id, AcademicRecordRequestDto requestDto) {
        AcademicRecord entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicRecord not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("AcademicRecord not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
