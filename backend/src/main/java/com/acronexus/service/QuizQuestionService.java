package com.acronexus.service;

import com.acronexus.dto.QuizQuestionDto;
import java.util.List;
import java.util.UUID;

public interface QuizQuestionService {
    QuizQuestionDto.Response addQuestion(QuizQuestionDto.CreateRequest request);
    QuizQuestionDto.Response updateQuestion(UUID questionId, QuizQuestionDto.UpdateRequest request);
    void deleteQuestion(UUID questionId);
    List<QuizQuestionDto.Response> getQuestionsByQuiz(UUID quizId);
}
