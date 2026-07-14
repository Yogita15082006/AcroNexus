package com.acronexus.mapper;

import com.acronexus.dto.QuizQuestionDto;
import com.acronexus.entity.QuizQuestion;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class QuizQuestionMapper {

    private final ObjectMapper objectMapper;

    public QuizQuestionDto.Response toResponseDto(QuizQuestion entity) {
        if (entity == null) return null;
        
        List<QuizQuestionDto.Option> optionsList = null;
        if (entity.getOptions() != null) {
            optionsList = objectMapper.convertValue(entity.getOptions(), new TypeReference<List<QuizQuestionDto.Option>>() {});
        }

        return QuizQuestionDto.Response.builder()
                .id(entity.getId())
                .quizId(entity.getQuiz().getId())
                .questionText(entity.getQuestionText())
                .options(optionsList)
                .marks(entity.getMarks())
                .build();
    }
}
