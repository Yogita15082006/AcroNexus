package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.ResourceDownloadRequestDto;
import com.acronexus.dto.ResourceDownloadResponseDto;
import com.acronexus.service.ResourceDownloadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resource-downloads")
@RequiredArgsConstructor
public class ResourceDownloadController {

    private final ResourceDownloadService service;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceDownloadResponseDto>> create(@Valid @RequestBody ResourceDownloadRequestDto requestDto) {
        ResourceDownloadResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("ResourceDownload created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDownloadResponseDto>> getById(@PathVariable UUID id) {
        ResourceDownloadResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("ResourceDownload fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceDownloadResponseDto>>> getAll() {
        List<ResourceDownloadResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("ResourceDownloads fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceDownloadResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody ResourceDownloadRequestDto requestDto) {
        ResourceDownloadResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("ResourceDownload updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("ResourceDownload deleted successfully", null));
    }
}
