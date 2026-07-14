package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.ExamScheduleRequestDto;
import com.acronexus.dto.ExamScheduleResponseDto;
import com.acronexus.service.ExamScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exam-schedules")
@RequiredArgsConstructor
public class ExamScheduleController {

    private final ExamScheduleService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY')")
    public ResponseEntity<ApiResponse<ExamScheduleResponseDto>> create(@Valid @RequestBody ExamScheduleRequestDto requestDto) {
        ExamScheduleResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("ExamSchedule created successfully", created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<ExamScheduleResponseDto>> getById(@PathVariable UUID id) {
        ExamScheduleResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("ExamSchedule fetched successfully", responseDto));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<ExamScheduleResponseDto>>> getAll() {
        List<ExamScheduleResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("ExamSchedules fetched successfully", list));
    }

    @GetMapping("/examination/{examinationId}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<ExamScheduleResponseDto>>> getByExaminationId(@PathVariable UUID examinationId) {
        List<ExamScheduleResponseDto> list = service.getByExaminationId(examinationId);
        return ResponseEntity.ok(ApiResponse.success("ExamSchedules fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY')")
    public ResponseEntity<ApiResponse<ExamScheduleResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody ExamScheduleRequestDto requestDto) {
        ExamScheduleResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("ExamSchedule updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HOD', 'COORDINATOR', 'FACULTY')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("ExamSchedule deleted successfully", null));
    }
}
