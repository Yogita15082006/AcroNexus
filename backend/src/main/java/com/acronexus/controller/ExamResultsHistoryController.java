package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.ExamResultsHistoryRequestDto;
import com.acronexus.dto.ExamResultsHistoryResponseDto;
import com.acronexus.service.ExamResultsHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exam-results-history")
@RequiredArgsConstructor
public class ExamResultsHistoryController {

    private final ExamResultsHistoryService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD')")
    public ResponseEntity<ApiResponse<ExamResultsHistoryResponseDto>> create(@Valid @RequestBody ExamResultsHistoryRequestDto requestDto) {
        ExamResultsHistoryResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("ExamResultsHistory created successfully", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<ExamResultsHistoryResponseDto>> getById(@PathVariable UUID id) {
        ExamResultsHistoryResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("ExamResultsHistory fetched successfully", responseDto));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<ExamResultsHistoryResponseDto>>> getAll() {
        List<ExamResultsHistoryResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("ExamResultsHistorys fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD')")
    public ResponseEntity<ApiResponse<ExamResultsHistoryResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody ExamResultsHistoryRequestDto requestDto) {
        ExamResultsHistoryResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("ExamResultsHistory updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("ExamResultsHistory deleted successfully", null));
    }
}
