package com.acronexus.repository;

import com.acronexus.entity.DegreeProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DegreeProgramRepository extends JpaRepository<DegreeProgram, java.util.UUID> {
    Optional<DegreeProgram> findByNameIgnoreCase(String name);
}
