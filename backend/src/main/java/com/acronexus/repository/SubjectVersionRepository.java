package com.acronexus.repository;

import com.acronexus.entity.SubjectVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

import com.acronexus.entity.AcademicYear;
import com.acronexus.entity.Semester;
import com.acronexus.entity.Subject;
import java.util.List;

@Repository
public interface SubjectVersionRepository extends JpaRepository<SubjectVersion, UUID> {
    List<SubjectVersion> findBySubjectAndAcademicYearAndSemesterAndResourceType(Subject subject, AcademicYear academicYear, Semester semester, String resourceType);
    
    List<SubjectVersion> findBySubjectIdAndAcademicYearIdAndSemesterIdAndResourceTypeOrderByVersionNumberDesc(UUID subjectId, UUID academicYearId, UUID semesterId, String resourceType);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(sv) FROM SubjectVersion sv WHERE sv.subject.department.id = :departmentId AND sv.resourceType = :resourceType")
    long countByDepartmentIdAndResourceType(@org.springframework.data.repository.query.Param("departmentId") UUID departmentId, @org.springframework.data.repository.query.Param("resourceType") String resourceType);
}
