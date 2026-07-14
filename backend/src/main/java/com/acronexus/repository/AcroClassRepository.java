package com.acronexus.repository;

import com.acronexus.entity.AcroClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcroClassRepository extends JpaRepository<AcroClass, java.util.UUID> {
    Optional<AcroClass> findByNameIgnoreCaseAndSectionIgnoreCase(String name, String section);
}
