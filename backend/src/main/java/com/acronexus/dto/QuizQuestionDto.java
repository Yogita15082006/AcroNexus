package com.acronexus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

public class QuizQuestionDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Option {
        private String id; // Can be A, B, C, D or UUID
        private String text;
        private boolean isCorrect;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private UUID id;
        private UUID quizId;
        private String questionText;
        private List<Option> options;
        private Integer marks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull(message = "Quiz ID is required")
        private UUID quizId;

        @NotBlank(message = "Question text is required")
        private String questionText;

        @NotEmpty(message = "Options are required")
        private List<Option> options;

        @NotNull(message = "Marks are required")
        private Integer marks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotBlank(message = "Question text is required")
        private String questionText;

        @NotEmpty(message = "Options are required")
        private List<Option> options;

        @NotNull(message = "Marks are required")
        private Integer marks;
    }
}
