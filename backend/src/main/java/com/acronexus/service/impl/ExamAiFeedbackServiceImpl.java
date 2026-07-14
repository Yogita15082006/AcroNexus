package com.acronexus.service.impl;

import com.acronexus.dto.ExamAiFeedbackRequestDto;
import com.acronexus.dto.ExamAiFeedbackResponseDto;
import com.acronexus.entity.ExamAiFeedback;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.ExamAiFeedbackMapper;
import com.acronexus.repository.ExamAiFeedbackRepository;
import com.acronexus.service.ExamAiFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamAiFeedbackServiceImpl implements ExamAiFeedbackService {

    private final ExamAiFeedbackRepository repository;
    private final ExamAiFeedbackMapper mapper;

    @Override
    @Transactional
    public ExamAiFeedbackResponseDto create(ExamAiFeedbackRequestDto requestDto) {
        ExamAiFeedback entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public ExamAiFeedbackResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("ExamAiFeedback not found with id: " + id));
    }

    @Override
    public List<ExamAiFeedbackResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExamAiFeedbackResponseDto update(UUID id, ExamAiFeedbackRequestDto requestDto) {
        ExamAiFeedback entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamAiFeedback not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("ExamAiFeedback not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
