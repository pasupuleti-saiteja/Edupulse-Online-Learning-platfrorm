package com.lms.controller;

import com.lms.dto.common.ApiResponse;
import com.lms.dto.common.PagedResponse;
import com.lms.dto.enrollment.EnrollmentRequest;
import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Enrollments", description = "Course Enrollment & Student Learning Records")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @Operation(summary = "Enroll current student in a course")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enroll(
            @Valid @RequestBody EnrollmentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        EnrollmentResponse response = enrollmentService.enrollStudent(currentUser.getId(), request.getCourseId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Enrolled in course successfully"));
    }

    @GetMapping("/my-courses")
    @Operation(summary = "Get list of courses enrolled by current user")
    public ResponseEntity<ApiResponse<PagedResponse<EnrollmentResponse>>> getMyCourses(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "enrollmentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PagedResponse<EnrollmentResponse> response = enrollmentService.getStudentEnrollments(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Get student enrollments for a specific course")
    public ResponseEntity<ApiResponse<PagedResponse<EnrollmentResponse>>> getCourseEnrollments(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrollmentDate").descending());
        PagedResponse<EnrollmentResponse> response = enrollmentService.getCourseEnrollments(
                courseId, currentUser.getId(), isAdmin, pageable
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get enrollment details by ID")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> getEnrollmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        EnrollmentResponse response = enrollmentService.getEnrollmentById(id, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: View all enrollments across platform")
    public ResponseEntity<ApiResponse<PagedResponse<EnrollmentResponse>>> getAllEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("enrollmentDate").descending());
        PagedResponse<EnrollmentResponse> response = enrollmentService.getAllEnrollmentsAdmin(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
