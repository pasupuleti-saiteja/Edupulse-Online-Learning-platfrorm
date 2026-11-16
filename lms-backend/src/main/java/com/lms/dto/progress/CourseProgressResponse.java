package com.lms.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressResponse {

    private Long courseId;
    private String courseTitle;
    private long totalLessons;
    private long completedLessons;
    private BigDecimal progressPercentage;
    private Boolean isFullyCompleted;
    private List<LessonStatusDTO> lessons;
}
