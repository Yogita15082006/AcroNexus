package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.UserNotificationRequestDto;
import com.acronexus.dto.UserNotificationResponseDto;
import com.acronexus.service.UserNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-notifications")
@RequiredArgsConstructor
public class UserNotificationController {

    private final UserNotificationService service;

    @PostMapping
    public ResponseEntity<ApiResponse<UserNotificationResponseDto>> create(@Valid @RequestBody UserNotificationRequestDto requestDto) {
        UserNotificationResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("UserNotification created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserNotificationResponseDto>> getById(@PathVariable UUID id) {
        UserNotificationResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("UserNotification fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserNotificationResponseDto>>> getAll() {
        List<UserNotificationResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("UserNotifications fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserNotificationResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody UserNotificationRequestDto requestDto) {
        UserNotificationResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("UserNotification updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("UserNotification deleted successfully", null));
    }
}
