package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "academic_years")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AcademicYear {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true, nullable = false)
    private String year;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive = false;
}