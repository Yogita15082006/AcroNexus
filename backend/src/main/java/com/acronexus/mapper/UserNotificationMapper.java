package com.acronexus.mapper;

import com.acronexus.dto.UserNotificationRequestDto;
import com.acronexus.dto.UserNotificationResponseDto;
import com.acronexus.entity.UserNotification;
import org.springframework.stereotype.Component;

@Component
public class UserNotificationMapper {
    
    public UserNotification toEntity(UserNotificationRequestDto dto) {
        if (dto == null) return null;
        UserNotification entity = new UserNotification();
        // Map fields
        return entity;
    }

    public UserNotificationResponseDto toDto(UserNotification entity) {
        if (entity == null) return null;
        UserNotificationResponseDto dto = new UserNotificationResponseDto();
        if(entity.getId() != null) {
            dto.setId(entity.getId());
        }
        // Map fields
        return dto;
    }
}
