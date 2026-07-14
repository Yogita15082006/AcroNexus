package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "faculties")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Faculty {
    @Id
    @Column(name = "user_id")
    private java.util.UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(unique = true, nullable = false)
    private String employeeId;
    
    private String designation;
    private LocalDate joiningDate;
    private String qualification;
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "expertise_areas")
    private List<String> expertiseAreas;
}