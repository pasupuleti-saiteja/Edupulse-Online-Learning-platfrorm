package com.lms.dto.dashboard;

import com.lms.dto.course.CourseResponse;
import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalStudents;
    private long totalInstructors;
    private long totalCourses;
    private long totalEnrollments;
    private long totalActiveUsers;
    private List<UserResponse> recentUsers;
    private List<CourseResponse> recentCourses;
    private List<EnrollmentResponse> recentEnrollments;
}
