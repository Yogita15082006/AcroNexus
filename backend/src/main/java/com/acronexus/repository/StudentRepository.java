package com.acronexus.repository;

import com.acronexus.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByEnrollmentNo(String enrollmentNo);
    Optional<Student> findByUser_Id(UUID userId);
}
