package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.StudentAttendanceRequestDto;
import com.acronexus.dto.StudentAttendanceResponseDto;
import com.acronexus.service.StudentAttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-attendance")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final StudentAttendanceService service;

    @PostMapping
    public ResponseEntity<ApiResponse<StudentAttendanceResponseDto>> create(@Valid @RequestBody StudentAttendanceRequestDto requestDto) {
        StudentAttendanceResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("StudentAttendance created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentAttendanceResponseDto>> getById(@PathVariable UUID id) {
        StudentAttendanceResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("StudentAttendance fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentAttendanceResponseDto>>> getAll() {
        List<StudentAttendanceResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("StudentAttendances fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentAttendanceResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody StudentAttendanceRequestDto requestDto) {
        StudentAttendanceResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("StudentAttendance updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("StudentAttendance deleted successfully", null));
    }
}
