package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.AcademicRecordRequestDto;
import com.acronexus.dto.AcademicRecordResponseDto;
import com.acronexus.service.AcademicRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/academic-records")
@RequiredArgsConstructor
public class AcademicRecordController {

    private final AcademicRecordService service;

    @PostMapping
    public ResponseEntity<ApiResponse<AcademicRecordResponseDto>> create(@Valid @RequestBody AcademicRecordRequestDto requestDto) {
        AcademicRecordResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("AcademicRecord created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicRecordResponseDto>> getById(@PathVariable UUID id) {
        AcademicRecordResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("AcademicRecord fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicRecordResponseDto>>> getAll() {
        List<AcademicRecordResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("AcademicRecords fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicRecordResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody AcademicRecordRequestDto requestDto) {
        AcademicRecordResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("AcademicRecord updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("AcademicRecord deleted successfully", null));
    }
}
