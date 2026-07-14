package com.acronexus.service.impl;

import com.acronexus.dto.UserNotificationRequestDto;
import com.acronexus.dto.UserNotificationResponseDto;
import com.acronexus.entity.UserNotification;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.UserNotificationMapper;
import com.acronexus.repository.UserNotificationRepository;
import com.acronexus.service.UserNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserNotificationServiceImpl implements UserNotificationService {

    private final UserNotificationRepository repository;
    private final UserNotificationMapper mapper;

    @Override
    @Transactional
    public UserNotificationResponseDto create(UserNotificationRequestDto requestDto) {
        UserNotification entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public UserNotificationResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("UserNotification not found with id: " + id));
    }

    @Override
    public List<UserNotificationResponseDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserNotificationResponseDto update(UUID id, UserNotificationRequestDto requestDto) {
        UserNotification entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserNotification not found with id: " + id));
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("UserNotification not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
