package com.acronexus.service.impl;

import com.acronexus.dto.ExamResultsHistoryRequestDto;
import com.acronexus.dto.ExamResultsHistoryResponseDto;
import com.acronexus.entity.ExamResultsHistory;
import com.acronexus.entity.User;
import com.acronexus.entity.UserRole;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.exception.UnauthorizedException;
import com.acronexus.mapper.ExamResultsHistoryMapper;
import com.acronexus.repository.ExamResultsHistoryRepository;
import com.acronexus.repository.UserRepository;
import com.acronexus.repository.ClassSubjectRepository;
import com.acronexus.security.UserDetailsImpl;
import com.acronexus.service.ExamResultsHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamResultsHistoryServiceImpl implements ExamResultsHistoryService {

    private final ExamResultsHistoryRepository repository;
    private final ExamResultsHistoryMapper mapper;
    private final UserRepository userRepository;
    private final ClassSubjectRepository classSubjectRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private boolean isAdmin() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private void verifyReadAccess(ExamResultsHistory history, User currentUser) {
        if (isAdmin()) {
            return;
        } else if (currentUser.getRole() == UserRole.HOD || currentUser.getRole() == UserRole.COORDINATOR) {
            if (currentUser.getDepartment() == null || !currentUser.getDepartment().getId().equals(history.getResult().getExamination().getDepartment().getId())) {
                throw new UnauthorizedException("Access Denied: Examination does not belong to your department");
            }
        } else if (currentUser.getRole() == UserRole.FACULTY) {
            boolean teachesSubject = classSubjectRepository.existsBySubjectIdAndFacultyIdAndIsActiveTrue(history.getResult().getSubject().getId(), currentUser.getId());
            if (!teachesSubject) {
                throw new UnauthorizedException("Access Denied: You are not assigned to this subject");
            }
        } else if (currentUser.getRole() == UserRole.STUDENT) {
            if (!history.getResult().getStudent().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("Access Denied: Cannot view another student's exam history");
            }
        }
    }

    private boolean hasReadAccess(ExamResultsHistory history, User currentUser) {
        try {
            verifyReadAccess(history, currentUser);
            return true;
        } catch (UnauthorizedException e) {
            return false;
        }
    }

    @Override
    @Transactional
    public ExamResultsHistoryResponseDto create(ExamResultsHistoryRequestDto requestDto) {
        ExamResultsHistory entity = mapper.toEntity(requestDto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public ExamResultsHistoryResponseDto getById(UUID id) {
        ExamResultsHistory history = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamResultsHistory not found with id: " + id));
        verifyReadAccess(history, getCurrentUser());
        return mapper.toDto(history);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamResultsHistoryResponseDto> getAll() {
        User currentUser = getCurrentUser();
        return repository.findAll().stream()
                .filter(history -> hasReadAccess(history, currentUser))
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExamResultsHistoryResponseDto update(UUID id, ExamResultsHistoryRequestDto requestDto) {
        ExamResultsHistory entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamResultsHistory not found with id: " + id));
        User currentUser = getCurrentUser();
        if (currentUser.getRole() == UserRole.HOD) {
            if (currentUser.getDepartment() == null || !currentUser.getDepartment().getId().equals(entity.getResult().getExamination().getDepartment().getId())) {
                throw new UnauthorizedException("Access Denied: Cannot modify history outside your department");
            }
        }
        // Update fields based on requestDto
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        ExamResultsHistory entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamResultsHistory not found with id: " + id));
        User currentUser = getCurrentUser();
        if (currentUser.getRole() == UserRole.HOD) {
            if (currentUser.getDepartment() == null || !currentUser.getDepartment().getId().equals(entity.getResult().getExamination().getDepartment().getId())) {
                throw new UnauthorizedException("Access Denied: Cannot delete history outside your department");
            }
        }
        repository.delete(entity);
    }
}
