package com.acronexus.repository;

import com.acronexus.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, UUID> {
    
    @EntityGraph(attributePaths = {"assignment", "student", "student.user", "file"})
    List<AssignmentSubmission> findByAssignmentIdOrderBySubmittedAtDesc(UUID assignmentId);
    
    Optional<AssignmentSubmission> findByAssignmentIdAndStudentId(UUID assignmentId, UUID studentId);
}
