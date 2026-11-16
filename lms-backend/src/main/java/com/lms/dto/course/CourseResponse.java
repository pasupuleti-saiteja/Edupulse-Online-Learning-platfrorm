package com.lms.dto.course;

import com.lms.entity.CourseLevel;
import com.lms.entity.CourseStatus;
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
public class CourseResponse {

    private Long courseId;
    private String title;
    private String description;
    private String category;
    private Long instructorId;
    private String instructorName;
    private String instructorEmail;
    private String thumbnail;
    private String duration;
    private BigDecimal price;
    private CourseLevel level;
    private CourseStatus status;
    private long totalLessons;
    private long totalEnrolledStudents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
