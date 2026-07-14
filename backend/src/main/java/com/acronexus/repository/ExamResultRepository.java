package com.acronexus.repository;

import com.acronexus.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, UUID> {
    Optional<ExamResult> findByExaminationIdAndStudentIdAndSubjectId(UUID examinationId, UUID studentId, UUID subjectId);
    java.util.List<ExamResult> findByStudentId(UUID studentId);
}
