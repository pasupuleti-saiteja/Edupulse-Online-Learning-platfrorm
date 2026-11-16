package com.lms.service.impl;

import com.lms.dto.common.PagedResponse;
import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.entity.*;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.exception.UnauthorizedException;
import com.lms.mapper.EnrollmentMapper;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonProgressRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.UserRepository;
import com.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Override
    public EnrollmentResponse enrollStudent(Long studentId, Long courseId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        if (student.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Your account is inactive. Please contact support.");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new BadRequestException("You can only enroll in published courses");
        }

        // Prevent instructor from enrolling in their own course
        if (course.getInstructor().getId().equals(studentId)) {
            throw new BadRequestException("Instructors cannot enroll in their own courses");
        }

        // Prevent duplicate enrollment
        if (enrollmentRepository.existsByStudentAndCourse(student, course)) {
            throw new BadRequestException("You are already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .enrollmentStatus(EnrollmentStatus.ACTIVE)
                .progressPercentage(BigDecimal.ZERO)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        long totalLessons = lessonRepository.countByCourseCourseId(courseId);
        return EnrollmentMapper.toResponse(saved, totalLessons, 0);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        Page<Enrollment> page = enrollmentRepository.findByStudent(student, pageable);
        List<EnrollmentResponse> responses = page.getContent().stream()
                .map(this::mapToEnrollmentResponse)
                .toList();

        return PagedResponse.of(page, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EnrollmentResponse> getCourseEnrollments(Long courseId, Long instructorId, boolean isAdmin, Pageable pageable) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        if (!isAdmin && !course.getInstructor().getId().equals(instructorId)) {
            throw new UnauthorizedException("You do not have permission to view enrollments for this course");
        }

        Page<Enrollment> page = enrollmentRepository.findByCourse(course, pageable);
        List<EnrollmentResponse> responses = page.getContent().stream()
                .map(this::mapToEnrollmentResponse)
                .toList();

        return PagedResponse.of(page, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<EnrollmentResponse> getAllEnrollmentsAdmin(Pageable pageable) {
        Page<Enrollment> page = enrollmentRepository.findAll(pageable);
        List<EnrollmentResponse> responses = page.getContent().stream()
                .map(this::mapToEnrollmentResponse)
                .toList();

        return PagedResponse.of(page, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseCourseId(studentId, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public EnrollmentResponse getEnrollmentById(Long enrollmentId, Long currentUserId, boolean isAdmin) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment", "id", enrollmentId));

        if (!isAdmin && !enrollment.getStudent().getId().equals(currentUserId)
                && !enrollment.getCourse().getInstructor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to access this enrollment record");
        }

        return mapToEnrollmentResponse(enrollment);
    }

    private EnrollmentResponse mapToEnrollmentResponse(Enrollment e) {
        long totalLessons = lessonRepository.countByCourseCourseId(e.getCourse().getCourseId());
        long completedLessons = lessonProgressRepository.countByEnrollmentEnrollmentIdAndIsCompletedTrue(e.getEnrollmentId());
        return EnrollmentMapper.toResponse(e, totalLessons, completedLessons);
    }
}
