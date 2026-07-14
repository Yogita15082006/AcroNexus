package com.acronexus.repository;

import com.acronexus.entity.ProfessionalDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProfessionalDetailRepository extends JpaRepository<ProfessionalDetail, UUID> {
}
