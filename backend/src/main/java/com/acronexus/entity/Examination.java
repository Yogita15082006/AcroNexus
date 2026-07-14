package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "examinations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Examination {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamType type;

    @Enumerated(EnumType.STRING)
    private ExamStatus status = ExamStatus.UPCOMING;

    private java.time.LocalDate startDate;
    private java.time.LocalDate endDate;

    private Boolean isDeleted = false;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.Instant createdAt;

}
