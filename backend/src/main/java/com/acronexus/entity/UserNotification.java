package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "user_notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 50)
    private String module;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 255)
    private String actionPath;

    @Column(length = 50)
    private String type;

    private Boolean isRead = false;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.Instant createdAt;

}
