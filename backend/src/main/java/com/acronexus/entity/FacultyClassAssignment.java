package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty_class_assignments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FacultyClassAssignment extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private AcroClass acroClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @Column(nullable = false)
    private java.time.LocalDate effectiveFrom;

    private java.time.LocalDate effectiveTo;

    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

}
