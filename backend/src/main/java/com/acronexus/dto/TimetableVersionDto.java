package com.acronexus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimetableVersionDto {
    private UUID id;
    private Integer versionNumber;
    private Boolean isActive;
    private String fileName;
    private String fileType;
    private Boolean isDeleted;
    private String uploadedBy;
    private ZonedDateTime uploadedAt;
}
