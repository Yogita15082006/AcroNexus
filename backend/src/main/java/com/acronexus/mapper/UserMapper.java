package com.acronexus.mapper;

import com.acronexus.dto.UserRequestDto;
import com.acronexus.dto.UserResponseDto;
import com.acronexus.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequestDto dto) {
        if (dto == null) return null;
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(dto.getPassword()); // Normally hashed in service layer
        user.setRole(dto.getRole());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setDob(dto.getDob());
        user.setBloodGroup(dto.getBloodGroup());
        user.setProfilePictureUrl(dto.getProfilePictureUrl());
        return user;
    }

    public UserResponseDto toDto(User entity) {
        if (entity == null) return null;
        UserResponseDto dto = new UserResponseDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setRole(entity.getRole());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setPhone(entity.getPhone());
        dto.setGender(entity.getGender());
        dto.setDob(entity.getDob());
        dto.setBloodGroup(entity.getBloodGroup());
        dto.setProfilePictureUrl(entity.getProfilePictureUrl());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }
}
