package com.acronexus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class AssignmentSubmissionDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private UUID id;
        private UUID assignmentId;
        private UUID studentId;
        private String studentName;
        private String studentEnrollmentNo;
        private UUID fileId;
        private String fileUrl;
        private String fileName;
        private Instant submittedAt;
        private BigDecimal marksAwarded;
        private String feedback;
        private Boolean isLate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitRequest {
        @NotNull(message = "File ID is required for submission")
        private UUID fileId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluateRequest {
        @NotNull(message = "Marks awarded is required")
        private BigDecimal marksAwarded;
        
        private String feedback;
    }
}
