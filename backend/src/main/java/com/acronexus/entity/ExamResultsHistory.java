package com.acronexus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "exam_results_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ExamResultsHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private ExamResult result;

    @Column(precision = 5, scale = 2)
    private java.math.BigDecimal previousMarksObtained;

    @Column(precision = 5, scale = 2)
    private java.math.BigDecimal newMarksObtained;

    @Column(columnDefinition = "TEXT")
    private String modificationReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modified_by")
    private User modifiedBy;

    @org.hibernate.annotations.CreationTimestamp
    private java.time.Instant modifiedAt;

}
