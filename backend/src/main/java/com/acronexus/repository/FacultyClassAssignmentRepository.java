package com.acronexus.repository;

import com.acronexus.entity.FacultyClassAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface FacultyClassAssignmentRepository extends JpaRepository<FacultyClassAssignment, UUID> {
}
