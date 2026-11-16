package com.lms.controller;

import com.lms.dto.common.ApiResponse;
import com.lms.dto.dashboard.InstructorDashboardResponse;
import com.lms.dto.dashboard.StudentDashboardResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Dashboards", description = "Role-Specific Dashboard Analytics (Instructor & Student)")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/api/instructor/dashboard")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Get Instructor Dashboard metrics (Courses, enrolled students, recent activity)")
    public ResponseEntity<ApiResponse<InstructorDashboardResponse>> getInstructorDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        InstructorDashboardResponse response = dashboardService.getInstructorDashboardStats(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/api/student/dashboard")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @Operation(summary = "Get Student Dashboard metrics (Active/completed courses, learning progress)")
    public ResponseEntity<ApiResponse<StudentDashboardResponse>> getStudentDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        StudentDashboardResponse response = dashboardService.getStudentDashboardStats(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
