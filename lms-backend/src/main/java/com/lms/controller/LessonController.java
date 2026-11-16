package com.lms.controller;

import com.lms.dto.common.ApiResponse;
import com.lms.dto.lesson.LessonRequest;
import com.lms.dto.lesson.LessonResponse;
import com.lms.security.UserPrincipal;
import com.lms.service.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Lessons", description = "Course Curricular Units & Lesson Content")
public class LessonController {

    private final LessonService lessonService;

    @PostMapping("/api/courses/{courseId}/lessons")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Add a new lesson to a course")
    public ResponseEntity<ApiResponse<LessonResponse>> addLesson(
            @PathVariable Long courseId,
            @Valid @RequestBody LessonRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        LessonResponse response = lessonService.addLesson(courseId, request, currentUser.getId(), isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Lesson created successfully"));
    }

    @GetMapping("/api/courses/{courseId}/lessons")
    @Operation(summary = "Get all lessons in a course (Requires enrollment or ownership)")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessonsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        List<LessonResponse> response = lessonService.getLessonsByCourse(courseId, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/api/lessons/{lessonId}")
    @Operation(summary = "Get a single lesson by ID")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        LessonResponse response = lessonService.getLessonById(lessonId, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/api/lessons/{lessonId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Update an existing lesson")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        LessonResponse response = lessonService.updateLesson(lessonId, request, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success(response, "Lesson updated successfully"));
    }

    @DeleteMapping("/api/lessons/{lessonId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Operation(summary = "Delete a lesson")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean isAdmin = currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        lessonService.deleteLesson(lessonId, currentUser.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success(null, "Lesson deleted successfully"));
    }
}
