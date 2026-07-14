package com.acronexus.repository;

import com.acronexus.entity.AcademicRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AcademicRecordRepository extends JpaRepository<AcademicRecord, UUID> {
}
