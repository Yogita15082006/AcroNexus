package com.acronexus.service.impl;

import com.acronexus.dto.AssignmentDto;
import com.acronexus.dto.AssignmentSubmissionDto;
import com.acronexus.entity.*;
import com.acronexus.repository.*;
import com.acronexus.security.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AssignmentServiceImplTest {

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private AssignmentSubmissionRepository assignmentSubmissionRepository;

    @Mock
    private ClassSubjectRepository classSubjectRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private FileStorageRepository fileStorageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AssignmentServiceImpl assignmentService;

    private User facultyUser;
    private User otherFacultyUser;
    private User studentUser;
    private Student student;
    private Assignment assignment;

    @BeforeEach
    void setUp() {
        facultyUser = new User();
        facultyUser.setId(UUID.randomUUID());
        facultyUser.setRole(UserRole.FACULTY);

        otherFacultyUser = new User();
        otherFacultyUser.setId(UUID.randomUUID());
        otherFacultyUser.setRole(UserRole.FACULTY);

        studentUser = new User();
        studentUser.setId(UUID.randomUUID());
        studentUser.setRole(UserRole.STUDENT);

        student = new Student();
        student.setId(studentUser.getId());
        student.setUser(studentUser);

        ClassSubject classSubject = new ClassSubject();
        classSubject.setId(UUID.randomUUID());
        Faculty faculty = new Faculty();
        faculty.setId(facultyUser.getId());
        faculty.setUser(facultyUser);
        classSubject.setFaculty(faculty);
        
        Subject subject = new Subject();
        subject.setName("Test Subject");
        classSubject.setSubject(subject);
        
        AcroClass acroClass = new AcroClass();
        acroClass.setName("Test Class");
        classSubject.setAcroClass(acroClass);

        assignment = new Assignment();
        assignment.setId(UUID.randomUUID());
        assignment.setCreatedBy(facultyUser);
        assignment.setClassSubject(classSubject);
        assignment.setMaxMarks(100);
        assignment.setDeadline(ZonedDateTime.now().plusDays(1));
        assignment.setIsDeleted(false);
    }

    private void mockSecurityContext(User user) {
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
    }

    @Test
    void updateAssignment_Failure_FacultyOwnershipCheck() {
        // Setup security context with a DIFFERENT faculty user
        mockSecurityContext(otherFacultyUser);
        
        when(assignmentRepository.findById(assignment.getId())).thenReturn(Optional.of(assignment));

        AssignmentDto.UpdateRequest request = new AssignmentDto.UpdateRequest();
        request.setTitle("Updated Title");

        Exception exception = assertThrows(RuntimeException.class, () -> {
            assignmentService.updateAssignment(assignment.getId(), request);
        });

        assertEquals("Access Denied: You do not own this assignment", exception.getMessage());
        verify(assignmentRepository, never()).save(any(Assignment.class));
    }
    
    @Test
    void evaluateSubmission_Failure_FacultyOwnershipCheck() {
        mockSecurityContext(otherFacultyUser);
        
        AssignmentSubmission submission = new AssignmentSubmission();
        submission.setId(UUID.randomUUID());
        submission.setAssignment(assignment);
        
        when(assignmentSubmissionRepository.findById(submission.getId())).thenReturn(Optional.of(submission));
        
        AssignmentSubmissionDto.EvaluateRequest request = new AssignmentSubmissionDto.EvaluateRequest();
        request.setMarksAwarded(BigDecimal.valueOf(50));
        
        Exception exception = assertThrows(RuntimeException.class, () -> {
            assignmentService.evaluateSubmission(submission.getId(), request);
        });

        assertEquals("Access Denied: You do not own this assignment", exception.getMessage());
    }

    @Test
    void submitAssignment_Failure_DeadlineExpired() {
        mockSecurityContext(studentUser);
        when(studentRepository.findById(studentUser.getId())).thenReturn(Optional.of(student));
        
        // Set deadline to past
        assignment.setDeadline(ZonedDateTime.now().minusDays(1));
        when(assignmentRepository.findById(assignment.getId())).thenReturn(Optional.of(assignment));
        
        // Mock that student is in the class
        when(assignmentRepository.findAssignmentsForStudent(studentUser.getId())).thenReturn(Collections.singletonList(assignment));

        AssignmentSubmissionDto.SubmitRequest request = new AssignmentSubmissionDto.SubmitRequest();
        request.setFileId(UUID.randomUUID());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            assignmentService.submitAssignment(assignment.getId(), request);
        });

        assertEquals("Due date has expired", exception.getMessage());
    }

    @Test
    void submitAssignment_Failure_StudentNotEnrolled() {
        mockSecurityContext(studentUser);
        when(studentRepository.findById(studentUser.getId())).thenReturn(Optional.of(student));
        
        when(assignmentRepository.findById(assignment.getId())).thenReturn(Optional.of(assignment));
        
        // Mock that student is NOT in the class (empty list returned)
        when(assignmentRepository.findAssignmentsForStudent(studentUser.getId())).thenReturn(Collections.emptyList());

        AssignmentSubmissionDto.SubmitRequest request = new AssignmentSubmissionDto.SubmitRequest();
        
        Exception exception = assertThrows(RuntimeException.class, () -> {
            assignmentService.submitAssignment(assignment.getId(), request);
        });

        assertEquals("Access Denied: You are not enrolled in the class for this assignment", exception.getMessage());
    }
}
