package com.acronexus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResourceVersionDto {
    private UUID id;
    private Integer versionNumber;
    private Boolean isActive;
    private String fileName;
    private String fileType;
    private Long fileSize; // We may not have this in FileStorage, let's skip or handle it
    private Boolean isDeleted;
    private String uploadedBy;
    private ZonedDateTime uploadedAt;
}
