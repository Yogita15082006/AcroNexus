package com.acronexus.repository;

import com.acronexus.entity.Notice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, UUID>, JpaSpecificationExecutor<Notice> {

    @Override
    @EntityGraph(attributePaths = {"file", "publishedBy", "targetDepartment", "targetClass"})
    List<Notice> findAll(org.springframework.data.jpa.domain.Specification<Notice> spec);

    @EntityGraph(attributePaths = {"file", "publishedBy", "targetDepartment", "targetClass"})
    @Query("""
        SELECT n FROM Notice n
        WHERE n.isActive = true 
          AND n.isDeleted = false
          AND (n.publishDate IS NULL OR n.publishDate <= CURRENT_TIMESTAMP)
          AND (n.targetRole IS NULL OR n.targetRole = 'STUDENT')
          AND (n.targetDepartment.id = :departmentId OR n.targetDepartment IS NULL)
          AND (n.targetClass.id = :classId OR n.targetClass IS NULL)
        ORDER BY n.priority DESC, n.publishDate DESC
    """)
    List<Notice> findStudentFeed(
            @Param("departmentId") UUID departmentId,
            @Param("classId") UUID classId
    );
    
    @EntityGraph(attributePaths = {"file", "publishedBy", "targetDepartment", "targetClass"})
    List<Notice> findAll();

    long countByIsDeletedFalseAndIsActiveTrue();
    long countByTargetDepartmentIdAndIsDeletedFalseAndIsActiveTrue(UUID departmentId);
}
