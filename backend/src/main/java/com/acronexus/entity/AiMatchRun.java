package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "ai_match_runs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AiMatchRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "triggered_by")
    private User triggeredBy;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.Instant triggerTime;

    private Integer studentsProcessed = 0;
    private Integer facultyProcessed = 0;
    private Integer subjectsProcessed = 0;
    private Integer classesCreated = 0;
    private Integer facultyAssignmentsCreated = 0;
    private Integer coordinatorAssignmentsCreated = 0;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object warnings;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object manualCorrections;

}
