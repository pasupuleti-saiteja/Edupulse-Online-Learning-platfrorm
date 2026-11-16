package com.lms.service;

import com.lms.dto.lesson.LessonRequest;
import com.lms.dto.lesson.LessonResponse;

import java.util.List;

public interface LessonService {

    LessonResponse addLesson(Long courseId, LessonRequest request, Long instructorId, boolean isAdmin);

    LessonResponse updateLesson(Long lessonId, LessonRequest request, Long instructorId, boolean isAdmin);

    void deleteLesson(Long lessonId, Long instructorId, boolean isAdmin);

    List<LessonResponse> getLessonsByCourse(Long courseId, Long currentUserId, boolean isAdmin);

    LessonResponse getLessonById(Long lessonId, Long currentUserId, boolean isAdmin);
}
