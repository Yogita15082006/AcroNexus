package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "student_attendance_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StudentAttendanceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_id", nullable = false)
    private StudentAttendance attendance;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modified_by")
    private User modifiedBy;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.Instant modifiedAt;

}
