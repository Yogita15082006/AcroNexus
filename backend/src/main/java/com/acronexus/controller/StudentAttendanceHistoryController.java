package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.StudentAttendanceHistoryRequestDto;
import com.acronexus.dto.StudentAttendanceHistoryResponseDto;
import com.acronexus.service.StudentAttendanceHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-attendance-history")
@RequiredArgsConstructor
public class StudentAttendanceHistoryController {

    private final StudentAttendanceHistoryService service;

    @PostMapping
    public ResponseEntity<ApiResponse<StudentAttendanceHistoryResponseDto>> create(@Valid @RequestBody StudentAttendanceHistoryRequestDto requestDto) {
        StudentAttendanceHistoryResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("StudentAttendanceHistory created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentAttendanceHistoryResponseDto>> getById(@PathVariable UUID id) {
        StudentAttendanceHistoryResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("StudentAttendanceHistory fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentAttendanceHistoryResponseDto>>> getAll() {
        List<StudentAttendanceHistoryResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("StudentAttendanceHistorys fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentAttendanceHistoryResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody StudentAttendanceHistoryRequestDto requestDto) {
        StudentAttendanceHistoryResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("StudentAttendanceHistory updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("StudentAttendanceHistory deleted successfully", null));
    }
}
