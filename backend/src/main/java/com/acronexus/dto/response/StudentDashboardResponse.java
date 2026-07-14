package com.acronexus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class StudentDashboardResponse {

    private AttendanceOverview attendanceOverview;
    private List<SubjectAttendance> subjectAttendance;
    private List<AssignmentSummary> upcomingAssignments;
    private List<AssignmentSummary> pendingAssignments;
    private List<QuizSummary> upcomingQuizzes;
    private List<QuizScoreSummary> recentQuizScores;
    private List<ExamSummary> upcomingExams;
    private List<NoticeSummary> latestNotices;
    private List<NotificationSummary> latestNotifications;
    private AcademicResourceSummary academicResources;

    @Data @Builder
    public static class AttendanceOverview {
        private long totalClasses;
        private long classesAttended;
        private double attendancePercentage;
    }

    @Data @Builder
    public static class SubjectAttendance {
        private String subjectName;
        private long totalClasses;
        private long classesAttended;
        private long classesMissed;
        private double percentage;
    }

    @Data @Builder
    public static class AssignmentSummary {
        private UUID id;
        private String title;
        private String subjectName;
        private String className;
        private ZonedDateTime deadline;
        private Integer maxMarks;
        private boolean submitted;
    }

    @Data @Builder
    public static class QuizSummary {
        private UUID id;
        private String title;
        private String subjectName;
        private Instant startTime;
        private Instant endTime;
        private Integer durationMinutes;
        private Integer totalMarks;
    }

    @Data @Builder
    public static class QuizScoreSummary {
        private UUID quizId;
        private String quizTitle;
        private BigDecimal score;
        private Integer totalMarks;
        private Instant completedAt;
    }

    @Data @Builder
    public static class ExamSummary {
        private UUID id;
        private String examinationName;
        private String subjectName;
        private java.time.LocalDate examDate;
        private java.time.LocalTime startTime;
        private java.time.LocalTime endTime;
        private String roomNumber;
    }

    @Data @Builder
    public static class NoticeSummary {
        private UUID id;
        private String title;
        private String category;
        private String priority;
        private ZonedDateTime publishDate;
    }

    @Data @Builder
    public static class NotificationSummary {
        private UUID id;
        private String title;
        private String message;
        private String type;
        private Boolean isRead;
        private Instant createdAt;
    }

    @Data @Builder
    public static class AcademicResourceSummary {
        private long schemeCount;
        private long syllabusCount;
        private Long timetableCount;
        private long lectureMaterialCount;
    }
}
