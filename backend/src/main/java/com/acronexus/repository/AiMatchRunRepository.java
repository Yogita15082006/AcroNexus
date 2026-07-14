package com.acronexus.repository;

import com.acronexus.entity.AiMatchRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AiMatchRunRepository extends JpaRepository<AiMatchRun, UUID> {
}
