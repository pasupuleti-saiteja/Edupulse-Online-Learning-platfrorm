package com.lms.controller;

import com.lms.dto.common.ApiResponse;
import com.lms.dto.progress.CourseProgressResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Progress", description = "Student Learning Progress & Lesson Completion Tracking")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/api/lessons/{lessonId}/complete")
    @Operation(summary = "Mark a lesson as completed by current enrolled student")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> markLessonCompleted(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CourseProgressResponse response = progressService.markLessonCompleted(lessonId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Lesson marked as completed"));
    }

    @GetMapping("/api/courses/{courseId}/progress")
    @Operation(summary = "Get overall learning progress and lesson completion statuses for a course")
    public ResponseEntity<ApiResponse<CourseProgressResponse>> getCourseProgress(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        CourseProgressResponse response = progressService.getCourseProgress(courseId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
