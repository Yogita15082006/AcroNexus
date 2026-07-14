package com.acronexus.service.impl;

import com.acronexus.dto.ExamResultRequestDto;
import com.acronexus.dto.ExamResultResponseDto;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.mapper.ExamResultMapper;
import com.acronexus.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ExamResultServiceImplTest {

    @Mock
    private ExamResultRepository repository;

    @Mock
    private ExamResultMapper mapper;

    @Mock
    private ExamResultsHistoryRepository historyRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ExamResultServiceImpl examResultService;

    private User facultyUser;
    private ExamResult examResult;

    @BeforeEach
    void setUp() {
        facultyUser = new User();
        facultyUser.setId(UUID.randomUUID());
        facultyUser.setRole(UserRole.FACULTY);

        examResult = new ExamResult();
        examResult.setId(UUID.randomUUID());
        examResult.setMarksObtained(BigDecimal.valueOf(50));
        examResult.setMaxMarks(BigDecimal.valueOf(100));
        examResult.setGrade("C");
    }

    private void mockSecurityContext(User user) {
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.getReferenceById(user.getId())).thenReturn(user);
    }

    @Test
    void updateExamResult_GeneratesHistoryRecord_WhenMarksChange() {
        mockSecurityContext(facultyUser);
        
        when(repository.findById(examResult.getId())).thenReturn(Optional.of(examResult));
        
        ExamResultResponseDto mockResponse = new ExamResultResponseDto();
        mockResponse.setId(examResult.getId());
        mockResponse.setMarksObtained(BigDecimal.valueOf(75));
        when(mapper.toDto(any(ExamResult.class))).thenReturn(mockResponse);
        when(repository.save(any(ExamResult.class))).thenReturn(examResult);

        ExamResultRequestDto request = new ExamResultRequestDto();
        request.setMarksObtained(BigDecimal.valueOf(75));
        request.setMaxMarks(BigDecimal.valueOf(100));
        request.setModificationReason("Re-evaluation");

        ExamResultResponseDto response = examResultService.update(examResult.getId(), request);

        ArgumentCaptor<ExamResultsHistory> historyCaptor = ArgumentCaptor.forClass(ExamResultsHistory.class);
        verify(historyRepository).save(historyCaptor.capture());

        ExamResultsHistory savedHistory = historyCaptor.getValue();
        assertEquals(examResult, savedHistory.getResult());
        assertEquals(BigDecimal.valueOf(50), savedHistory.getPreviousMarksObtained());
        assertEquals(BigDecimal.valueOf(75), savedHistory.getNewMarksObtained());
        assertEquals("Re-evaluation", savedHistory.getModificationReason());
        assertEquals(facultyUser, savedHistory.getModifiedBy());

        assertEquals(BigDecimal.valueOf(75), response.getMarksObtained());
    }
}
