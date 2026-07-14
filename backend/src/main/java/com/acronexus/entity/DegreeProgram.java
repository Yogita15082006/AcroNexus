package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "degree_programs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DegreeProgram {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id")
    private Campus campus;
    
    private String name;
    
    @Enumerated(EnumType.STRING)
    private DegreeType type;
    
    private Integer durationYears;
    private Boolean isActive = true;
    private Boolean isDeleted = false;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;
}