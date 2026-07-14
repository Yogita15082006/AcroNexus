package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "resource_downloads")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ResourceDownload {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private LectureMaterial material;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.Instant downloadedAt;

}
