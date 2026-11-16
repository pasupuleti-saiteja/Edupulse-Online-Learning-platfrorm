package com.lms.dto.dashboard;

import com.lms.dto.course.CourseResponse;
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
public class InstructorDashboardResponse {

    private long totalCourses;
    private long totalPublishedCourses;
    private long totalEnrolledStudents;
    private List<CourseResponse> recentCourses;
    private List<EnrollmentResponse> recentEnrollments;
}
