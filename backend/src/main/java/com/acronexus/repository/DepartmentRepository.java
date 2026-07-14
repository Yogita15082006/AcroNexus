package com.acronexus.repository;

import com.acronexus.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, java.util.UUID> {
    Optional<Department> findByNameIgnoreCase(String name);
}
