package com.lms.service.impl;

import com.lms.dto.progress.CourseProgressResponse;
import com.lms.dto.progress.LessonStatusDTO;
import com.lms.entity.*;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.exception.UnauthorizedException;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonProgressRepository;
import com.lms.repository.LessonRepository;
import com.lms.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProgressServiceImpl implements ProgressService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Override
    public CourseProgressResponse markLessonCompleted(Long lessonId, Long studentId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        Course course = lesson.getCourse();

        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseCourseId(studentId, course.getCourseId())
                .orElseThrow(() -> new UnauthorizedException("You are not enrolled in this course"));

        // Upsert lesson progress
        LessonProgress progress = lessonProgressRepository
                .findByEnrollmentEnrollmentIdAndLessonLessonId(enrollment.getEnrollmentId(), lessonId)
                .orElseGet(() -> LessonProgress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .build());

        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());
        lessonProgressRepository.save(progress);

        // Recalculate progress percentage
        long totalLessons = lessonRepository.countByCourseCourseId(course.getCourseId());
        long completedLessons = lessonProgressRepository.countByEnrollmentEnrollmentIdAndIsCompletedTrue(enrollment.getEnrollmentId());

        BigDecimal percentage = BigDecimal.ZERO;
        if (totalLessons > 0) {
            percentage = BigDecimal.valueOf(completedLessons)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalLessons), 2, RoundingMode.HALF_UP);
        }

        enrollment.setProgressPercentage(percentage);
        if (percentage.compareTo(BigDecimal.valueOf(100)) >= 0) {
            enrollment.setEnrollmentStatus(EnrollmentStatus.COMPLETED);
        } else {
            enrollment.setEnrollmentStatus(EnrollmentStatus.ACTIVE);
        }
        enrollmentRepository.save(enrollment);

        return buildCourseProgressResponse(course, enrollment, totalLessons, completedLessons, percentage);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseProgressResponse getCourseProgress(Long courseId, Long studentId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseCourseId(studentId, courseId)
                .orElseThrow(() -> new UnauthorizedException("You are not enrolled in this course"));

        Course course = enrollment.getCourse();
        long totalLessons = lessonRepository.countByCourseCourseId(courseId);
        long completedLessons = lessonProgressRepository.countByEnrollmentEnrollmentIdAndIsCompletedTrue(enrollment.getEnrollmentId());

        return buildCourseProgressResponse(course, enrollment, totalLessons, completedLessons, enrollment.getProgressPercentage());
    }

    private CourseProgressResponse buildCourseProgressResponse(
            Course course, Enrollment enrollment, long totalLessons, long completedLessons, BigDecimal percentage) {

        List<Lesson> lessons = lessonRepository.findByCourseOrderBySequenceNumberAsc(course);
        List<LessonStatusDTO> lessonStatuses = lessons.stream()
                .map(l -> {
                    LessonProgress lp = lessonProgressRepository
                            .findByEnrollmentEnrollmentIdAndLessonLessonId(enrollment.getEnrollmentId(), l.getLessonId())
                            .orElse(null);

                    boolean completed = lp != null && Boolean.TRUE.equals(lp.getIsCompleted());
                    return LessonStatusDTO.builder()
                            .lessonId(l.getLessonId())
                            .title(l.getTitle())
                            .sequenceNumber(l.getSequenceNumber())
                            .duration(l.getDuration())
                            .isCompleted(completed)
                            .completedAt(lp != null ? lp.getCompletedAt() : null)
                            .build();
                })
                .toList();

        return CourseProgressResponse.builder()
                .courseId(course.getCourseId())
                .courseTitle(course.getTitle())
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .progressPercentage(percentage)
                .isFullyCompleted(completedLessons >= totalLessons && totalLessons > 0)
                .lessons(lessonStatuses)
                .build();
    }
}
