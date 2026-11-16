package com.lms.mapper;

import com.lms.dto.lesson.LessonRequest;
import com.lms.dto.lesson.LessonResponse;
import com.lms.entity.Course;
import com.lms.entity.Lesson;
import com.lms.entity.LessonProgress;

public class LessonMapper {

    public static Lesson toEntity(LessonRequest request, Course course) {
        return Lesson.builder()
                .course(course)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .content(request.getContent())
                .sequenceNumber(request.getSequenceNumber())
                .duration(request.getDuration())
                .build();
    }

    public static void updateEntity(Lesson lesson, LessonRequest request) {
        lesson.setTitle(request.getTitle());
        lesson.setDescription(request.getDescription());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setContent(request.getContent());
        lesson.setSequenceNumber(request.getSequenceNumber());
        lesson.setDuration(request.getDuration());
    }

    public static LessonResponse toResponse(Lesson lesson, LessonProgress progress) {
        if (lesson == null) return null;
        return LessonResponse.builder()
                .lessonId(lesson.getLessonId())
                .courseId(lesson.getCourse().getCourseId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .videoUrl(lesson.getVideoUrl())
                .content(lesson.getContent())
                .sequenceNumber(lesson.getSequenceNumber())
                .duration(lesson.getDuration())
                .isCompleted(progress != null && Boolean.TRUE.equals(progress.getIsCompleted()))
                .completedAt(progress != null ? progress.getCompletedAt() : null)
                .createdAt(lesson.getCreatedAt())
                .build();
    }
}
