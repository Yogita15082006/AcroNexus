package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Subject extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    @Column(unique = true, nullable = false)
    private String code;
    private String name;
    private Integer credits;
    private String type;
    private Boolean isActive = true;
    private Boolean isDeleted = false;
}