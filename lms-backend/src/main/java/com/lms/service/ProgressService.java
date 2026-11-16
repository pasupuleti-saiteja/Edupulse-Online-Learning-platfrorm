package com.lms.service;

import com.lms.dto.progress.CourseProgressResponse;

public interface ProgressService {

    CourseProgressResponse markLessonCompleted(Long lessonId, Long studentId);

    CourseProgressResponse getCourseProgress(Long courseId, Long studentId);
}
