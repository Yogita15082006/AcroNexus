package com.acronexus.repository;

import com.acronexus.entity.ExamAiFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ExamAiFeedbackRepository extends JpaRepository<ExamAiFeedback, UUID> {
}
