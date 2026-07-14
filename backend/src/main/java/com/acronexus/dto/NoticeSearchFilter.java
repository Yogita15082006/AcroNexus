package com.acronexus.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class NoticeSearchFilter {
    private String keyword;
    private String title;
    private UUID departmentId;
    private UUID academicYearId;
    private UUID semesterId;
    private UUID classId;
    private String category;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
}
