package com.acronexus.service.impl;

import com.acronexus.dto.ExaminationRequestDto;
import com.acronexus.dto.ExaminationResponseDto;
import com.acronexus.entity.Department;
import com.acronexus.entity.Examination;
import com.acronexus.entity.Semester;
import com.acronexus.exception.DuplicateResourceException;
import com.acronexus.exception.ResourceNotFoundException;
import com.acronexus.mapper.ExaminationMapper;
import com.acronexus.repository.DepartmentRepository;
import com.acronexus.repository.ExaminationRepository;
import com.acronexus.repository.SemesterRepository;
import com.acronexus.repository.UserRepository;
import com.acronexus.security.UserDetailsImpl;
import com.acronexus.service.ExaminationService;
import com.acronexus.entity.User;
import com.acronexus.entity.UserRole;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationServiceImpl implements ExaminationService {

    private final ExaminationRepository repository;
    private final DepartmentRepository departmentRepository;
    private final SemesterRepository semesterRepository;
    private final ExaminationMapper mapper;
    private final UserRepository userRepository;

    private void verifyDepartmentAccess(Department department) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (currentUser.getRole() == UserRole.HOD || currentUser.getRole() == UserRole.COORDINATOR) {
            if (currentUser.getDepartment() != null && !currentUser.getDepartment().getId().equals(department.getId())) {
                throw new RuntimeException("Access Denied: Examination does not belong to your department");
            }
        } else if (currentUser.getRole() == UserRole.FACULTY) {
            throw new RuntimeException("Access Denied: Faculty cannot manage examinations");
        }
    }

    @Override
    @Transactional
    public ExaminationResponseDto create(ExaminationRequestDto requestDto) {
        if (repository.existsByDepartmentIdAndSemesterIdAndTypeAndIsDeletedFalse(
                requestDto.getDepartmentId(), requestDto.getSemesterId(), requestDto.getType())) {
            throw new DuplicateResourceException("Examination of this type already exists for the given department and semester");
        }

        Department department = departmentRepository.findById(requestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Semester semester = semesterRepository.findById(requestDto.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        verifyDepartmentAccess(department);

        Examination entity = mapper.toEntity(requestDto);
        entity.setDepartment(department);
        entity.setSemester(semester);
        
        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public ExaminationResponseDto getById(UUID id) {
        return repository.findByIdAndIsDeletedFalse(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExaminationResponseDto> getAll() {
        return repository.findAllByIsDeletedFalse().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExaminationResponseDto update(UUID id, ExaminationRequestDto requestDto) {
        Examination entity = repository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found with id: " + id));

        if (repository.existsByDepartmentIdAndSemesterIdAndTypeAndIsDeletedFalseAndIdNot(
                requestDto.getDepartmentId(), requestDto.getSemesterId(), requestDto.getType(), id)) {
            throw new DuplicateResourceException("Another examination of this type already exists for the given department and semester");
        }

        Department department = departmentRepository.findById(requestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Semester semester = semesterRepository.findById(requestDto.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found"));

        verifyDepartmentAccess(entity.getDepartment());
        verifyDepartmentAccess(department);

        entity.setName(requestDto.getName());
        entity.setType(requestDto.getType());
        entity.setStartDate(requestDto.getStartDate());
        entity.setEndDate(requestDto.getEndDate());
        entity.setDepartment(department);
        entity.setSemester(semester);

        return mapper.toDto(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Examination entity = repository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examination not found with id: " + id));
        verifyDepartmentAccess(entity.getDepartment());
        entity.setIsDeleted(true);
        repository.save(entity);
    }
}
