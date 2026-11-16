package com.lms.mapper;

import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.entity.Enrollment;

public class EnrollmentMapper {

    public static EnrollmentResponse toResponse(Enrollment enrollment, long totalLessons, long completedLessons) {
        if (enrollment == null) return null;
        return EnrollmentResponse.builder()
                .enrollmentId(enrollment.getEnrollmentId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getFullName())
                .studentEmail(enrollment.getStudent().getEmail())
                .courseId(enrollment.getCourse().getCourseId())
                .courseTitle(enrollment.getCourse().getTitle())
                .courseThumbnail(enrollment.getCourse().getThumbnail())
                .courseCategory(enrollment.getCourse().getCategory())
                .instructorName(enrollment.getCourse().getInstructor().getFullName())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .enrollmentStatus(enrollment.getEnrollmentStatus())
                .progressPercentage(enrollment.getProgressPercentage())
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .build();
    }
}
