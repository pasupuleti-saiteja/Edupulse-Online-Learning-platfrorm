package com.lms.mapper;

import com.lms.dto.course.CourseRequest;
import com.lms.dto.course.CourseResponse;
import com.lms.entity.Course;
import com.lms.entity.CourseStatus;
import com.lms.entity.User;

public class CourseMapper {

    public static Course toEntity(CourseRequest request, User instructor) {
        return Course.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .instructor(instructor)
                .thumbnail(request.getThumbnail())
                .duration(request.getDuration())
                .price(request.getPrice())
                .level(request.getLevel())
                .status(request.getStatus() != null ? request.getStatus() : CourseStatus.DRAFT)
                .build();
    }

    public static void updateEntity(Course course, CourseRequest request) {
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setCategory(request.getCategory());
        course.setThumbnail(request.getThumbnail());
        course.setDuration(request.getDuration());
        course.setPrice(request.getPrice());
        course.setLevel(request.getLevel());
        if (request.getStatus() != null) {
            course.setStatus(request.getStatus());
        }
    }

    public static CourseResponse toResponse(Course course, long totalLessons, long totalEnrolled) {
        if (course == null) return null;
        return CourseResponse.builder()
                .courseId(course.getCourseId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .instructorId(course.getInstructor().getId())
                .instructorName(course.getInstructor().getFullName())
                .instructorEmail(course.getInstructor().getEmail())
                .thumbnail(course.getThumbnail())
                .duration(course.getDuration())
                .price(course.getPrice())
                .level(course.getLevel())
                .status(course.getStatus())
                .totalLessons(totalLessons)
                .totalEnrolledStudents(totalEnrolled)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
