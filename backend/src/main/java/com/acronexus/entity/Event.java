package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String venue;

    @Column(name = "event_date")
    private Instant eventDate;

    @Column(name = "registration_start")
    private Instant registrationStart;

    @Column(name = "registration_end")
    private Instant registrationEnd;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_class_id")
    private AcroClass targetClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "poster_file_id")
    private FileStorage posterFile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
