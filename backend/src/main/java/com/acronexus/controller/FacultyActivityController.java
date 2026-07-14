package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.FacultyActivityRequestDto;
import com.acronexus.dto.FacultyActivityResponseDto;
import com.acronexus.service.FacultyActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/faculty-activities")
@RequiredArgsConstructor
public class FacultyActivityController {

    private final FacultyActivityService service;

    @PostMapping
    public ResponseEntity<ApiResponse<FacultyActivityResponseDto>> create(@Valid @RequestBody FacultyActivityRequestDto requestDto) {
        FacultyActivityResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("FacultyActivity created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyActivityResponseDto>> getById(@PathVariable UUID id) {
        FacultyActivityResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("FacultyActivity fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacultyActivityResponseDto>>> getAll() {
        List<FacultyActivityResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("FacultyActivitys fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyActivityResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody FacultyActivityRequestDto requestDto) {
        FacultyActivityResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("FacultyActivity updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("FacultyActivity deleted successfully", null));
    }
}
