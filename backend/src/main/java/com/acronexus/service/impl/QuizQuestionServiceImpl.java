package com.acronexus.service.impl;

import com.acronexus.dto.QuizQuestionDto;
import com.acronexus.entity.Quiz;
import com.acronexus.entity.QuizQuestion;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.QuizQuestionMapper;
import com.acronexus.repository.QuizQuestionRepository;
import com.acronexus.repository.QuizRepository;
import com.acronexus.service.QuizQuestionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizQuestionServiceImpl implements QuizQuestionService {

    private final QuizQuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionMapper mapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public QuizQuestionDto.Response addQuestion(QuizQuestionDto.CreateRequest request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        QuizQuestion question = new QuizQuestion();
        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setOptions(objectMapper.convertValue(request.getOptions(), Object.class));
        question.setMarks(request.getMarks());

        return mapper.toResponseDto(questionRepository.save(question));
    }

    @Override
    @Transactional
    public QuizQuestionDto.Response updateQuestion(UUID questionId, QuizQuestionDto.UpdateRequest request) {
        QuizQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        question.setQuestionText(request.getQuestionText());
        question.setOptions(objectMapper.convertValue(request.getOptions(), Object.class));
        question.setMarks(request.getMarks());

        return mapper.toResponseDto(questionRepository.save(question));
    }

    @Override
    @Transactional
    public void deleteQuestion(UUID questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResourceNotFoundException("Question not found");
        }
        questionRepository.deleteById(questionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizQuestionDto.Response> getQuestionsByQuiz(UUID quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found");
        }
        return questionRepository.findByQuiz_Id(quizId).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
