package com.acronexus.repository;

import com.acronexus.entity.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, java.util.UUID> {
    Optional<StudentEnrollment> findByStudentIdAndAcademicYearIdAndSemesterId(
            java.util.UUID studentId, java.util.UUID academicYearId, java.util.UUID semesterId);

    boolean existsByStudentIdAndAcroClassIdAndIsActiveTrue(java.util.UUID studentId, java.util.UUID classId);
    
    Optional<StudentEnrollment> findFirstByStudentUserIdAndIsActiveTrueOrderByCreatedAtDesc(java.util.UUID studentId);
}
