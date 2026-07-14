package com.acronexus.service;

import com.acronexus.dto.UserNotificationRequestDto;
import com.acronexus.dto.UserNotificationResponseDto;
import java.util.List;
import java.util.UUID;

public interface UserNotificationService {
    UserNotificationResponseDto create(UserNotificationRequestDto requestDto);
    UserNotificationResponseDto getById(UUID id);
    List<UserNotificationResponseDto> getAll();
    UserNotificationResponseDto update(UUID id, UserNotificationRequestDto requestDto);
    void delete(UUID id);
}
