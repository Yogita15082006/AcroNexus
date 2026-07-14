package com.acronexus.service.impl;

import com.acronexus.dto.StudentAttendanceHistoryRequestDto;
import com.acronexus.dto.StudentAttendanceHistoryResponseDto;
import com.acronexus.entity.StudentAttendanceHistory;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.StudentAttendanceHistoryMapper;
import com.acronexus.repository.StudentAttendanceHistoryRepository;
import com.acronexus.service.StudentAttendanceHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentAttendanceHistoryServiceImpl implements StudentAttendanceHistoryService {

    private final StudentAttendanceHistoryRepository repository;
    private final StudentAttendanceHistoryMapper mapper;

    @Override
    @Transactional
    public StudentAttendanceHistoryResponseDto create(StudentAttendanceHistoryRequestDto requestDto) {
        StudentAttendanceHistory entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public StudentAttendanceHistoryResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("StudentAttendanceHistory not found with id: " + id));
    }

    @Override
    public List<StudentAttendanceHistoryResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentAttendanceHistoryResponseDto update(UUID id, StudentAttendanceHistoryRequestDto requestDto) {
        StudentAttendanceHistory entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudentAttendanceHistory not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("StudentAttendanceHistory not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
