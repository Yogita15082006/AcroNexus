package com.acronexus.repository;

import com.acronexus.entity.ExamResultsHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ExamResultsHistoryRepository extends JpaRepository<ExamResultsHistory, UUID> {
}
