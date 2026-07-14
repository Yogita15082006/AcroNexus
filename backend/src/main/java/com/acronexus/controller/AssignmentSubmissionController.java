package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.AssignmentSubmissionRequestDto;
import com.acronexus.dto.AssignmentSubmissionResponseDto;
import com.acronexus.service.AssignmentSubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignment-submissions")
@RequiredArgsConstructor
public class AssignmentSubmissionController {

    private final AssignmentSubmissionService service;

    @PostMapping
    public ResponseEntity<ApiResponse<AssignmentSubmissionResponseDto>> create(@Valid @RequestBody AssignmentSubmissionRequestDto requestDto) {
        AssignmentSubmissionResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AssignmentSubmission created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentSubmissionResponseDto>> getById(@PathVariable UUID id) {
        AssignmentSubmissionResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("AssignmentSubmission fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentSubmissionResponseDto>>> getAll() {
        List<AssignmentSubmissionResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("AssignmentSubmissions fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentSubmissionResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody AssignmentSubmissionRequestDto requestDto) {
        AssignmentSubmissionResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("AssignmentSubmission updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("AssignmentSubmission deleted successfully", null));
    }
}
