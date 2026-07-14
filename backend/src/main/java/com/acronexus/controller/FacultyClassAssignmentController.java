package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.FacultyClassAssignmentRequestDto;
import com.acronexus.dto.FacultyClassAssignmentResponseDto;
import com.acronexus.service.FacultyClassAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/faculty-class-assignments")
@RequiredArgsConstructor
public class FacultyClassAssignmentController {

    private final FacultyClassAssignmentService service;

    @PostMapping
    public ResponseEntity<ApiResponse<FacultyClassAssignmentResponseDto>> create(@Valid @RequestBody FacultyClassAssignmentRequestDto requestDto) {
        FacultyClassAssignmentResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("FacultyClassAssignment created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyClassAssignmentResponseDto>> getById(@PathVariable UUID id) {
        FacultyClassAssignmentResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("FacultyClassAssignment fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacultyClassAssignmentResponseDto>>> getAll() {
        List<FacultyClassAssignmentResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("FacultyClassAssignments fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyClassAssignmentResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody FacultyClassAssignmentRequestDto requestDto) {
        FacultyClassAssignmentResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("FacultyClassAssignment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("FacultyClassAssignment deleted successfully", null));
    }
}
