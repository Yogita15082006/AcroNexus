package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.ProfessionalDetailRequestDto;
import com.acronexus.dto.ProfessionalDetailResponseDto;
import com.acronexus.service.ProfessionalDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/professional-details")
@RequiredArgsConstructor
public class ProfessionalDetailController {

    private final ProfessionalDetailService service;

    @PostMapping
    public ResponseEntity<ApiResponse<ProfessionalDetailResponseDto>> create(@Valid @RequestBody ProfessionalDetailRequestDto requestDto) {
        ProfessionalDetailResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("ProfessionalDetail created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfessionalDetailResponseDto>> getById(@PathVariable UUID id) {
        ProfessionalDetailResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("ProfessionalDetail fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProfessionalDetailResponseDto>>> getAll() {
        List<ProfessionalDetailResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("ProfessionalDetails fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProfessionalDetailResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody ProfessionalDetailRequestDto requestDto) {
        ProfessionalDetailResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("ProfessionalDetail updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("ProfessionalDetail deleted successfully", null));
    }
}
