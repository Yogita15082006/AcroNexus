package com.acronexus.repository;

import com.acronexus.entity.StudentAttendanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface StudentAttendanceHistoryRepository extends JpaRepository<StudentAttendanceHistory, UUID> {
}
