package com.acronexus.repository;

import com.acronexus.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, java.util.UUID> {
    java.util.Optional<Faculty> findByEmployeeId(String employeeId);
}
