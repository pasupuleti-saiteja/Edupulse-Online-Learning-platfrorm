package com.lms.dto.enrollment;

import com.lms.entity.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {

    private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long courseId;
    private String courseTitle;
    private String courseThumbnail;
    private String courseCategory;
    private String instructorName;
    private LocalDateTime enrollmentDate;
    private EnrollmentStatus enrollmentStatus;
    private BigDecimal progressPercentage;
    private long totalLessons;
    private long completedLessons;
}
