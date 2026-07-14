package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.TimetableRequestDto;
import com.acronexus.dto.TimetableResponseDto;
import com.acronexus.service.TimetableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/timetables")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService service;

    @PostMapping
    public ResponseEntity<ApiResponse<TimetableResponseDto>> create(@Valid @RequestBody TimetableRequestDto requestDto) {
        TimetableResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Timetable created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TimetableResponseDto>> getById(@PathVariable UUID id) {
        TimetableResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Timetable fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TimetableResponseDto>>> getAll() {
        List<TimetableResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("Timetables fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimetableResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody TimetableRequestDto requestDto) {
        TimetableResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Timetable updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Timetable deleted successfully", null));
    }
}
