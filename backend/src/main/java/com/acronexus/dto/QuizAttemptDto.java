package com.acronexus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class QuizAttemptDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private UUID quizId;
        private String quizTitle;
        private UUID studentId;
        private String studentName;
        private BigDecimal score;
        private Integer totalMarks;
        private BigDecimal percentage;
        private Boolean passed;
        private Integer correctAnswers;
        private Integer wrongAnswers;
        private Instant startedAt;
        private Instant completedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitRequest {
        // Map of Question UUID to Option ID
        @NotNull(message = "Answers are required")
        private Map<UUID, String> answers;
    }
}
