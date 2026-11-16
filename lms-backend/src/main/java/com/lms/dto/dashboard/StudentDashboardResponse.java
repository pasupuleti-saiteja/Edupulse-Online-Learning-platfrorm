package com.lms.dto.dashboard;

import com.lms.dto.enrollment.EnrollmentResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardResponse {

    private long totalEnrolledCourses;
    private long completedCourses;
    private long inProgressCourses;
    private Double averageProgressPercentage;
    private List<EnrollmentResponse> recentEnrollments;
}
