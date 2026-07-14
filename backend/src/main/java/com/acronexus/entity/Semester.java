package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "semesters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;
    private Integer semesterNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive = false;
}