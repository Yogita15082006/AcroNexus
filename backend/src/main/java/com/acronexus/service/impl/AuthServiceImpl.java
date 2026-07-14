package com.acronexus.service.impl;

import com.acronexus.dto.*;
import com.acronexus.entity.User;
import com.acronexus.repository.UserRepository;
import com.acronexus.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.acronexus.exception.ResourceNotFoundException("User not found"));
                
        if (!passwordEncoder.matches(requestDto.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect current password");
        }
        
        user.setPasswordHash(passwordEncoder.encode(requestDto.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequestDto requestDto) {
        // Structure for forgot password
        userRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new com.acronexus.exception.ResourceNotFoundException("User not found with email: " + requestDto.getEmail()));
        
        // Generate reset token and send email (to be implemented later)
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDto requestDto) {
        // Structure for reset password
        // Validate token (to be implemented later)
        
        // Mock token validation logic for structure
        // User user = findUserByToken(requestDto.getToken());
        // user.setPasswordHash(passwordEncoder.encode(requestDto.getNewPassword()));
        // userRepository.save(user);
        
        throw new RuntimeException("Reset password functionality not fully implemented yet");
    }

    @Override
    public UserProfileResponseDto getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.acronexus.exception.ResourceNotFoundException("User not found"));
                
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .gender(user.getGender())
                .dob(user.getDob())
                .bloodGroup(user.getBloodGroup())
                .profilePictureUrl(user.getProfilePictureUrl())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponseDto updateProfile(UUID userId, UpdateProfileRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.acronexus.exception.ResourceNotFoundException("User not found"));
                
        user.setFirstName(requestDto.getFirstName());
        user.setLastName(requestDto.getLastName());
        user.setPhone(requestDto.getPhone());
        user.setGender(requestDto.getGender());
        user.setDob(requestDto.getDob());
        user.setBloodGroup(requestDto.getBloodGroup());
        user.setProfilePictureUrl(requestDto.getProfilePictureUrl());
        
        userRepository.save(user);
        
        return getUserProfile(userId);
    }
}
