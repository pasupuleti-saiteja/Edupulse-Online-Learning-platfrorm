package com.lms.service.impl;

import com.lms.dto.lesson.LessonRequest;
import com.lms.dto.lesson.LessonResponse;
import com.lms.entity.Course;
import com.lms.entity.Enrollment;
import com.lms.entity.Lesson;
import com.lms.entity.LessonProgress;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.exception.UnauthorizedException;
import com.lms.mapper.LessonMapper;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonProgressRepository;
import com.lms.repository.LessonRepository;
import com.lms.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Override
    public LessonResponse addLesson(Long courseId, LessonRequest request, Long instructorId, boolean isAdmin) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        validateCourseOwnership(course, instructorId, isAdmin);

        Integer sequence = request.getSequenceNumber();
        if (sequence == null || sequence <= 0) {
            sequence = lessonRepository.findMaxSequenceNumberByCourseId(courseId) + 1;
            request.setSequenceNumber(sequence);
        } else {
            // Check if sequence already exists
            Optional<Lesson> existing = lessonRepository.findByCourseCourseIdAndSequenceNumber(courseId, sequence);
            if (existing.isPresent()) {
                throw new BadRequestException("A lesson with sequence number " + sequence + " already exists in this course");
            }
        }

        Lesson lesson = LessonMapper.toEntity(request, course);
        Lesson saved = lessonRepository.save(lesson);
        return LessonMapper.toResponse(saved, null);
    }

    @Override
    public LessonResponse updateLesson(Long lessonId, LessonRequest request, Long instructorId, boolean isAdmin) {
        Lesson lesson = findLessonById(lessonId);
        validateCourseOwnership(lesson.getCourse(), instructorId, isAdmin);

        if (!lesson.getSequenceNumber().equals(request.getSequenceNumber())) {
            Optional<Lesson> conflict = lessonRepository.findByCourseCourseIdAndSequenceNumber(
                    lesson.getCourse().getCourseId(), request.getSequenceNumber()
            );
            if (conflict.isPresent() && !conflict.get().getLessonId().equals(lessonId)) {
                throw new BadRequestException("Sequence number " + request.getSequenceNumber() + " is already taken by another lesson");
            }
        }

        LessonMapper.updateEntity(lesson, request);
        Lesson updated = lessonRepository.save(lesson);
        return LessonMapper.toResponse(updated, null);
    }

    @Override
    public void deleteLesson(Long lessonId, Long instructorId, boolean isAdmin) {
        Lesson lesson = findLessonById(lessonId);
        validateCourseOwnership(lesson.getCourse(), instructorId, isAdmin);
        lessonRepository.delete(lesson);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LessonResponse> getLessonsByCourse(Long courseId, Long currentUserId, boolean isAdmin) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        // Check view permission: Admin, Course Instructor, or Enrolled Student
        Optional<Enrollment> enrollment = Optional.empty();
        if (!isAdmin && !course.getInstructor().getId().equals(currentUserId)) {
            enrollment = enrollmentRepository.findByStudentIdAndCourseCourseId(currentUserId, courseId);
            if (enrollment.isEmpty()) {
                throw new UnauthorizedException("You must be enrolled in this course to access its lessons");
            }
        } else if (currentUserId != null) {
            enrollment = enrollmentRepository.findByStudentIdAndCourseCourseId(currentUserId, courseId);
        }

        final Optional<Enrollment> activeEnrollment = enrollment;
        List<Lesson> lessons = lessonRepository.findByCourseOrderBySequenceNumberAsc(course);

        return lessons.stream()
                .map(lesson -> {
                    LessonProgress progress = null;
                    if (activeEnrollment.isPresent()) {
                        progress = lessonProgressRepository.findByEnrollmentEnrollmentIdAndLessonLessonId(
                                activeEnrollment.get().getEnrollmentId(), lesson.getLessonId()
                        ).orElse(null);
                    }
                    return LessonMapper.toResponse(lesson, progress);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long lessonId, Long currentUserId, boolean isAdmin) {
        Lesson lesson = findLessonById(lessonId);
        Course course = lesson.getCourse();

        Optional<Enrollment> enrollment = Optional.empty();
        if (!isAdmin && !course.getInstructor().getId().equals(currentUserId)) {
            enrollment = enrollmentRepository.findByStudentIdAndCourseCourseId(currentUserId, course.getCourseId());
            if (enrollment.isEmpty()) {
                throw new UnauthorizedException("You must be enrolled in this course to view this lesson");
            }
        } else if (currentUserId != null) {
            enrollment = enrollmentRepository.findByStudentIdAndCourseCourseId(currentUserId, course.getCourseId());
        }

        LessonProgress progress = null;
        if (enrollment.isPresent()) {
            progress = lessonProgressRepository.findByEnrollmentEnrollmentIdAndLessonLessonId(
                    enrollment.get().getEnrollmentId(), lesson.getLessonId()
            ).orElse(null);
        }

        return LessonMapper.toResponse(lesson, progress);
    }

    private Lesson findLessonById(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
    }

    private void validateCourseOwnership(Course course, Long instructorId, boolean isAdmin) {
        if (!isAdmin && !course.getInstructor().getId().equals(instructorId)) {
            throw new UnauthorizedException("You do not have permission to manage lessons for this course");
        }
    }
}
