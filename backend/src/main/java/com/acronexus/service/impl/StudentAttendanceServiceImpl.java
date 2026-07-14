package com.acronexus.service.impl;

import com.acronexus.dto.StudentAttendanceRequestDto;
import com.acronexus.dto.StudentAttendanceResponseDto;
import com.acronexus.entity.StudentAttendance;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.StudentAttendanceMapper;
import com.acronexus.repository.StudentAttendanceRepository;
import com.acronexus.service.StudentAttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentAttendanceServiceImpl implements StudentAttendanceService {

    private final StudentAttendanceRepository repository;
    private final StudentAttendanceMapper mapper;

    @Override
    @Transactional
    public StudentAttendanceResponseDto create(StudentAttendanceRequestDto requestDto) {
        StudentAttendance entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public StudentAttendanceResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("StudentAttendance not found with id: " + id));
    }

    @Override
    public List<StudentAttendanceResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentAttendanceResponseDto update(UUID id, StudentAttendanceRequestDto requestDto) {
        StudentAttendance entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("StudentAttendance not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("StudentAttendance not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
