package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "exam_schedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ExamSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examination_id", nullable = false)
    private Examination examination;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false)
    private java.time.LocalDate examDate;

    @Column(nullable = false)
    private java.time.LocalTime startTime;

    @Column(nullable = false)
    private java.time.LocalTime endTime;

    @Column(length = 50)
    private String roomNumber;

}
