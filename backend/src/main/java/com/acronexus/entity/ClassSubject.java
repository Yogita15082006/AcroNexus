package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "class_subjects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ClassSubject extends BaseAuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private AcroClass acroClass;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private Boolean isActive = true;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}