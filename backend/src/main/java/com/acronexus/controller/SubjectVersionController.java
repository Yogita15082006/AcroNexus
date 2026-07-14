package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.SubjectVersionRequestDto;
import com.acronexus.dto.SubjectVersionResponseDto;
import com.acronexus.service.SubjectVersionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subject-versions")
@RequiredArgsConstructor
public class SubjectVersionController {

    private final SubjectVersionService service;

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectVersionResponseDto>> create(@Valid @RequestBody SubjectVersionRequestDto requestDto) {
        SubjectVersionResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("SubjectVersion created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectVersionResponseDto>> getById(@PathVariable UUID id) {
        SubjectVersionResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("SubjectVersion fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectVersionResponseDto>>> getAll() {
        List<SubjectVersionResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("SubjectVersions fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectVersionResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody SubjectVersionRequestDto requestDto) {
        SubjectVersionResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("SubjectVersion updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("SubjectVersion deleted successfully", null));
    }
}
