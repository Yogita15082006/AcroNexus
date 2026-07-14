package com.acronexus.service.impl;

import com.acronexus.dto.QuizAttemptDto;
import com.acronexus.dto.QuizQuestionDto;
import com.acronexus.entity.*;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.exception.UnauthorizedException;
import com.acronexus.mapper.QuizAttemptMapper;
import com.acronexus.mapper.QuizQuestionMapper;
import com.acronexus.repository.*;
import com.acronexus.security.UserDetailsImpl;
import com.acronexus.service.QuizAttemptService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizAttemptRepository attemptRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final QuizAttemptMapper attemptMapper;
    private final QuizQuestionMapper questionMapper;
    private final ObjectMapper objectMapper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        }
        throw new UnauthorizedException("User not authenticated");
    }

    private Student getCurrentStudent() {
        User user = getCurrentUser();
        return studentRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizAttemptDto.Response> getAttemptsForQuiz(UUID quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        
        User user = getCurrentUser();
        if (user.getRole() == UserRole.FACULTY && !quiz.getCreatedBy().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view attempts for this quiz");
        }

        return attemptRepository.findByQuiz_Id(quizId).stream()
                .map(attemptMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<QuizQuestionDto.Response> startQuiz(UUID quizId) {
        Student student = getCurrentStudent();
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        Instant now = Instant.now();
        if (now.isBefore(quiz.getStartTime()) || now.isAfter(quiz.getEndTime())) {
            throw new IllegalArgumentException("Quiz is not currently active");
        }

        Optional<QuizAttempt> existingAttempt = attemptRepository.findByQuiz_IdAndStudent_User_Id(quizId, student.getUser().getId());
        if (existingAttempt.isPresent() && existingAttempt.get().getCompletedAt() != null) {
            throw new IllegalArgumentException("You have already completed this quiz");
        }

        if (existingAttempt.isEmpty()) {
            QuizAttempt newAttempt = new QuizAttempt();
            newAttempt.setQuiz(quiz);
            newAttempt.setStudent(student);
            newAttempt.setStartedAt(now);
            newAttempt.setScore(BigDecimal.ZERO);
            attemptRepository.save(newAttempt);
        }

        List<QuizQuestion> questions = questionRepository.findByQuiz_Id(quizId);
        return questions.stream().map(q -> {
            QuizQuestionDto.Response dto = questionMapper.toResponseDto(q);
            // Hide correct answers from student
            if (dto.getOptions() != null) {
                dto.getOptions().forEach(opt -> opt.setCorrect(false));
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuizAttemptDto.Response submitQuiz(UUID quizId, QuizAttemptDto.SubmitRequest request) {
        Student student = getCurrentStudent();
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        QuizAttempt attempt = attemptRepository.findByQuiz_IdAndStudent_User_Id(quizId, student.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("Quiz attempt not started"));

        if (attempt.getCompletedAt() != null) {
            throw new IllegalArgumentException("Quiz already submitted");
        }

        Instant now = Instant.now();
        if (now.isAfter(quiz.getEndTime().plusSeconds(120))) { // 2-minute grace period
            throw new IllegalArgumentException("Quiz has ended and can no longer be submitted");
        }

        List<QuizQuestion> questions = questionRepository.findByQuiz_Id(quizId);
        int totalScore = 0;

        Map<UUID, String> answers = request.getAnswers();
        if (answers != null) {
            for (QuizQuestion question : questions) {
                String submittedOptionId = answers.get(question.getId());
                if (submittedOptionId != null) {
                    List<QuizQuestionDto.Option> options = objectMapper.convertValue(question.getOptions(), new TypeReference<>() {});
                    boolean isCorrect = options.stream()
                            .anyMatch(opt -> opt.getId().equals(submittedOptionId) && opt.isCorrect());
                    
                    if (isCorrect) {
                        totalScore += (question.getMarks() != null ? question.getMarks() : 1);
                    }
                }
            }
        }

        attempt.setScore(new BigDecimal(totalScore));
        attempt.setCompletedAt(Instant.now());
        
        return attemptMapper.toResponseDto(attemptRepository.save(attempt));
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizAttemptDto.Response> getStudentResults() {
        Student student = getCurrentStudent();
        return attemptRepository.findByStudent_User_Id(student.getUser().getId()).stream()
                .map(attemptMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuizAttemptDto.Response> getAttemptsForQuizAdmin(UUID quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found");
        }
        return attemptRepository.findByQuiz_Id(quizId).stream()
                .map(attemptMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
