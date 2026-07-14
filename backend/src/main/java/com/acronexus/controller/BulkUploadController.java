package com.acronexus.controller;

import com.acronexus.dto.ApiResponse;
import com.acronexus.dto.BulkUploadRequestDto;
import com.acronexus.dto.BulkUploadResponseDto;
import com.acronexus.service.BulkUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bulk-uploads")
@RequiredArgsConstructor
public class BulkUploadController {

    private final BulkUploadService service;
    private final com.acronexus.service.StudentBulkUploadService studentBulkUploadService;

    @PostMapping("/students")
    public ResponseEntity<ApiResponse<BulkUploadResponseDto>> uploadStudents(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.acronexus.security.UserDetailsImpl userDetails = (com.acronexus.security.UserDetailsImpl) authentication.getPrincipal();
        
        BulkUploadResponseDto response = studentBulkUploadService.uploadStudentList(file, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Student list uploaded successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BulkUploadResponseDto>> create(@Valid @RequestBody BulkUploadRequestDto requestDto) {
        BulkUploadResponseDto created = service.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("BulkUpload created successfully", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BulkUploadResponseDto>> getById(@PathVariable UUID id) {
        BulkUploadResponseDto responseDto = service.getById(id);
        return ResponseEntity.ok(ApiResponse.success("BulkUpload fetched successfully", responseDto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BulkUploadResponseDto>>> getAll() {
        List<BulkUploadResponseDto> list = service.getAll();
        return ResponseEntity.ok(ApiResponse.success("BulkUploads fetched successfully", list));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BulkUploadResponseDto>> update(@PathVariable UUID id, @Valid @RequestBody BulkUploadRequestDto requestDto) {
        BulkUploadResponseDto updated = service.update(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("BulkUpload updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("BulkUpload deleted successfully", null));
    }
}
