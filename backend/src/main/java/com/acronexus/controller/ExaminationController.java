package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.ExaminationRequestDto;
import com.acronexus.dto.ExaminationResponseDto;
import com.acronexus.service.ExaminationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/examinations")
@RequiredArgsConstructor
public class ExaminationController {

    private final ExaminationService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY')")
    public ResponseEntity<ApiResponse<ExaminationResponseDto>> create(@Valid @RequestBody ExaminationRequestDto requestDto) {
        ExaminationResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Examination created successfully", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<ExaminationResponseDto>> getById(@PathVariable UUID id) {
        ExaminationResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Examination fetched successfully", responseDto));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<ExaminationResponseDto>>> getAll() {
        List<ExaminationResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("Examinations fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY')")
    public ResponseEntity<ApiResponse<ExaminationResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody ExaminationRequestDto requestDto) {
        ExaminationResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Examination updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Examination deleted successfully", null));
    }
}
