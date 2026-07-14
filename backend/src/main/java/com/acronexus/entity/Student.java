package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id
    @Column(name = "user_id")
    private java.util.UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(unique = true, nullable = false)
    private String enrollmentNo;
    
    private String rollNo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "degree_program_id")
    private DegreeProgram degreeProgram;
    
    @Column(nullable = false)
    private String batchYear;
}