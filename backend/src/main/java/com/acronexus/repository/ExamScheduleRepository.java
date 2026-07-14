package com.acronexus.repository;

import com.acronexus.entity.ExamSchedule;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, UUID> {

    @EntityGraph(attributePaths = {"examination", "subject"})
    Optional<ExamSchedule> findById(UUID id);

    @EntityGraph(attributePaths = {"examination", "subject"})
    List<ExamSchedule> findAllByExaminationId(UUID examinationId);

    boolean existsByExaminationIdAndSubjectId(UUID examinationId, UUID subjectId);

    boolean existsByExaminationIdAndSubjectIdAndIdNot(UUID examinationId, UUID subjectId, UUID id);
    
    boolean existsByExamDateAndRoomNumberAndStartTimeLessThanAndEndTimeGreaterThan(
            LocalDate examDate, String roomNumber, LocalTime endTime, LocalTime startTime);
            
    boolean existsByExamDateAndRoomNumberAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
            LocalDate examDate, String roomNumber, LocalTime endTime, LocalTime startTime, UUID id);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT es FROM ExamSchedule es " +
            "JOIN FETCH es.examination e " +
            "JOIN FETCH es.subject s " +
            "JOIN ClassSubject cs ON cs.subject = s " +
            "WHERE cs.acroClass.id = :classId " +
            "AND cs.academicYear.id = :academicYearId " +
            "AND e.semester.id = :semesterId " +
            "AND e.department.id = :departmentId " +
            "AND cs.isActive = true")
    List<ExamSchedule> findAllByStudentEnrollment(
            @org.springframework.data.repository.query.Param("classId") UUID classId,
            @org.springframework.data.repository.query.Param("academicYearId") UUID academicYearId,
            @org.springframework.data.repository.query.Param("semesterId") UUID semesterId,
            @org.springframework.data.repository.query.Param("departmentId") UUID departmentId);
}
