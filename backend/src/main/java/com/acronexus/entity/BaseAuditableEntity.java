package com.acronexus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.ZonedDateTime;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseAuditableEntity extends BaseEntity {
    @Column(name = "updated_at")
    @UpdateTimestamp
    private ZonedDateTime updatedAt;
}
