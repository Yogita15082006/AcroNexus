package com.acronexus.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class TimetableResponseDto {
    private UUID id;
    private String title;
    private String type; // "Timetable"
    private String className;
    private String semester;
    private String updated;
    private String uploader;
    private String size;
    private Integer versionNumber;
    private Boolean isActive;
}
