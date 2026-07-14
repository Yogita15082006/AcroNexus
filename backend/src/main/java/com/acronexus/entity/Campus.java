package com.acronexus.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campuses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Campus extends BaseAuditableEntity {
    private String name;
    private String address;
    private Boolean isActive = true;
    private Boolean isDeleted = false;
}