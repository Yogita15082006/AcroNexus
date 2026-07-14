package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subject_versions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SubjectVersion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id")
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @Column(nullable = false, length = 50)
    private String resourceType;

    private Integer versionNumber = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private FileStorage file;

    private Boolean isActive = true;

}
