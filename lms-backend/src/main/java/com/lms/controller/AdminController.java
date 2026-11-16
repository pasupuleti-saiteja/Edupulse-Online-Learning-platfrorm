package com.lms.controller;

import com.lms.dto.common.ApiResponse;
import com.lms.dto.common.PagedResponse;
import com.lms.dto.course.CourseResponse;
import com.lms.dto.dashboard.AdminDashboardResponse;
import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.dto.user.UserResponse;
import com.lms.dto.user.UserStatusUpdateRequest;
import com.lms.entity.Role;
import com.lms.service.CourseService;
import com.lms.service.DashboardService;
import com.lms.service.EnrollmentService;
import com.lms.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin Management", description = "Administrative Control, Platform Overview & User Governance")
public class AdminController {

    private final UserService userService;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide statistics for the Admin Dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> getDashboard() {
        AdminDashboardResponse response = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated users with optional role and keyword search")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PagedResponse<UserResponse> response = userService.getAllUsers(role, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/students")
    @Operation(summary = "Get paginated list of students")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<UserResponse> response = userService.getAllUsers(Role.STUDENT, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/instructors")
    @Operation(summary = "Get paginated list of instructors")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getInstructors(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<UserResponse> response = userService.getAllUsers(Role.INSTRUCTOR, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/courses")
    @Operation(summary = "Get all courses across the platform (Draft, Published, Archived)")
    public ResponseEntity<ApiResponse<PagedResponse<CourseResponse>>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PagedResponse<CourseResponse> response = courseService.getAllCoursesAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/enrollments")
    @Operation(summary = "Get all platform enrollments")
    public ResponseEntity<ApiResponse<PagedResponse<EnrollmentResponse>>> getAllEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrollmentDate").descending());
        PagedResponse<EnrollmentResponse> response = enrollmentService.getAllEnrollmentsAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Activate or Deactivate a user account")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request
    ) {
        UserResponse response = userService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(response, "User status updated to " + request.getStatus()));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }
}
