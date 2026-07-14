package com.acronexus.service.impl;

import com.acronexus.dto.ExamScheduleRequestDto;
import com.acronexus.dto.ExamScheduleResponseDto;
import com.acronexus.entity.ExamSchedule;
import com.acronexus.entity.Examination;
import com.acronexus.entity.Subject;
import com.acronexus.entity.User;
import com.acronexus.entity.UserRole;
import com.acronexus.exception.DuplicateResourceException;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.ExamScheduleMapper;
import com.acronexus.repository.ExamScheduleRepository;
import com.acronexus.repository.ExaminationRepository;
import com.acronexus.repository.SubjectRepository;
import com.acronexus.repository.UserRepository;
import com.acronexus.repository.ClassSubjectRepository;
import com.acronexus.repository.StudentEnrollmentRepository;
import com.acronexus.entity.StudentEnrollment;
import com.acronexus.security.UserDetailsImpl;
import com.acronexus.service.ExamScheduleService;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ExamScheduleServiceImpl implements ExamScheduleService {

    private final ExamScheduleRepository repository;
    private final ExaminationRepository examinationRepository;
    private final SubjectRepository subjectRepository;
    private final ExamScheduleMapper mapper;
    private final UserRepository userRepository;
    private final ClassSubjectRepository classSubjectRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    
    private void verifyAccess(Subject subject, Examination examination) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (currentUser.getRole() == UserRole.FACULTY) {
            boolean teachesSubject = classSubjectRepository.existsBySubjectIdAndFacultyIdAndIsActiveTrue(subject.getId(), currentUser.getId());
            if (!teachesSubject) {
                throw new RuntimeException("Access Denied: You are not assigned to this subject");
            }
        } else if (currentUser.getRole() == UserRole.HOD || currentUser.getRole() == UserRole.COORDINATOR) {
            if (currentUser.getDepartment() != null && !currentUser.getDepartment().getId().equals(examination.getDepartment().getId())) {
                throw new RuntimeException("Access Denied: Examination does not belong to your department");
            }
        }
    }

    @Override
    @Transactional
    public ExamScheduleResponseDto create(ExamScheduleRequestDto requestDto) {
        if (!requestDto.getStartTime().isBefore(requestDto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (repository.existsByExaminationIdAndSubjectId(requestDto.getExaminationId(), requestDto.getSubjectId())) {
            throw new DuplicateResourceException("This subject is already scheduled for the selected examination");
        }

        if (repository.existsByExamDateAndRoomNumberAndStartTimeLessThanAndEndTimeGreaterThan(
                requestDto.getExamDate(), requestDto.getRoomNumber(), requestDto.getEndTime(), requestDto.getStartTime())) {
            throw new DuplicateResourceException("Room is already booked for the given time slot");
        }

        Examination examination = examinationRepository.findByIdAndIsDeletedFalse(requestDto.getExaminationId())
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found"));
        Subject subject = subjectRepository.findById(requestDto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        verifyAccess(subject, examination);

        ExamSchedule entity = mapper.toEntity(requestDto);
        entity.setExamination(examination);
        entity.setSubject(subject);
        
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public ExamScheduleResponseDto getById(UUID id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("ExamSchedule not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamScheduleResponseDto> getAll() {
        return getFilteredSchedules().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ExamScheduleResponseDto> getByExaminationId(UUID examinationId) {
        return getFilteredSchedules().stream()
                .filter(s -> s.getExamination().getId().equals(examinationId))
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamScheduleResponseDto> getUpcoming() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        return getFilteredSchedules().stream()
                .filter(s -> s.getExamDate().isAfter(today) || (s.getExamDate().isEqual(today) && s.getEndTime().isAfter(now)))
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamScheduleResponseDto> getPast() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        return getFilteredSchedules().stream()
                .filter(s -> s.getExamDate().isBefore(today) || (s.getExamDate().isEqual(today) && !s.getEndTime().isAfter(now)))
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    private List<ExamSchedule> getFilteredSchedules() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() == UserRole.STUDENT) {
            StudentEnrollment enrollment = studentEnrollmentRepository.findFirstByStudentUserIdAndIsActiveTrueOrderByCreatedAtDesc(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("No active enrollment found for the student"));

            return repository.findAllByStudentEnrollment(
                    enrollment.getAcroClass().getId(),
                    enrollment.getAcademicYear().getId(),
                    enrollment.getSemester().getId(),
                    enrollment.getAcroClass().getDepartment().getId()
            );
        } else if (currentUser.getRole() == UserRole.HOD || currentUser.getRole() == UserRole.COORDINATOR) {
            return repository.findAll().stream()
                    .filter(s -> s.getExamination().getDepartment().getId().equals(currentUser.getDepartment().getId()))
                    .collect(Collectors.toList());
        } else if (currentUser.getRole() == UserRole.FACULTY) {
            return repository.findAll().stream()
                    .filter(s -> classSubjectRepository.existsBySubjectIdAndFacultyIdAndIsActiveTrue(s.getSubject().getId(), currentUser.getId()))
                    .collect(Collectors.toList());
        }

        return repository.findAll();
    }

    @Override
    @Transactional
    public ExamScheduleResponseDto update(UUID id, ExamScheduleRequestDto requestDto) {
        if (!requestDto.getStartTime().isBefore(requestDto.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        ExamSchedule entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ExamSchedule not found with id: " + id));

        if (repository.existsByExaminationIdAndSubjectIdAndIdNot(requestDto.getExaminationId(), requestDto.getSubjectId(), id)) {
            throw new DuplicateResourceException("Another schedule for this subject exists for the selected examination");
        }

        if (repository.existsByExamDateAndRoomNumberAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
                requestDto.getExamDate(), requestDto.getRoomNumber(), requestDto.getEndTime(), requestDto.getStartTime(), id)) {
            throw new DuplicateResourceException("Room is already booked for the given time slot");
        }

        Examination examination = examinationRepository.findByIdAndIsDeletedFalse(requestDto.getExaminationId())
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found"));
        Subject subject = subjectRepository.findById(requestDto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        verifyAccess(subject, examination);

        entity.setExamDate(requestDto.getExamDate());
        entity.setStartTime(requestDto.getStartTime());
        entity.setEndTime(requestDto.getEndTime());
        entity.setRoomNumber(requestDto.getRoomNumber());
        entity.setExamination(examination);
        entity.setSubject(subject);

        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        ExamSchedule entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ExamSchedule not found with id: " + id));
        verifyAccess(entity.getSubject(), entity.getExamination());
        repository.deleteById(id);
    }
}
