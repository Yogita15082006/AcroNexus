package com.acronexus.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HodDashboardResponse {

    private long departmentStudentCount;
    private long departmentFacultyCount;
    private long attendanceRecordCount;
    private long assignmentCount;
    private long quizCount;
    private long examinationCount;
    private long noticeCount;
    private long notificationCount;
    private AcademicResourceSummary academicResources;

    @Data @Builder
    public static class AcademicResourceSummary {
        private long totalSchemes;
        private long totalSyllabus;
        private Long totalTimetables;
        private long totalLectureMaterials;
    }
}
