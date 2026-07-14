package com.acronexus.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {
    private long totalStudents;
    private long totalFaculty;
    private long totalDepartments;
    private long totalClasses;
    private long totalSubjects;
    private long totalAssignments;
    private long totalQuizzes;
    private long totalExaminations;
    private long totalNotices;
    private long totalNotifications;
    private long totalAcademicResources;
}
