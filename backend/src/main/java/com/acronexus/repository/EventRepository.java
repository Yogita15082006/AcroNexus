package com.acronexus.repository;

import com.acronexus.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {

    @EntityGraph(attributePaths = {"department", "targetClass", "posterFile", "createdBy"})
    Page<Event> findAllByDepartmentId(UUID departmentId, Pageable pageable);

    @EntityGraph(attributePaths = {"department", "targetClass", "posterFile", "createdBy"})
    Page<Event> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"department", "targetClass", "posterFile", "createdBy"})
    Optional<Event> findById(UUID id);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.department LEFT JOIN FETCH e.targetClass LEFT JOIN FETCH e.posterFile LEFT JOIN FETCH e.createdBy WHERE e.isActive = true AND (e.department.id = :departmentId OR e.department IS NULL) AND (e.targetClass.id = :classId OR e.targetClass IS NULL) AND (e.registrationEnd >= :now OR e.registrationEnd IS NULL) ORDER BY e.eventDate ASC")
    List<Event> findAvailableEventsForStudent(@Param("departmentId") UUID departmentId, @Param("classId") UUID classId, @Param("now") Instant now);
}
