package com.lms.service;

import com.lms.dto.dashboard.AdminDashboardResponse;
import com.lms.dto.dashboard.InstructorDashboardResponse;
import com.lms.dto.dashboard.StudentDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboardStats();

    InstructorDashboardResponse getInstructorDashboardStats(Long instructorId);

    StudentDashboardResponse getStudentDashboardStats(Long studentId);
}
