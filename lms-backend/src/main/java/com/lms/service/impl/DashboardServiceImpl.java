package com.lms.service.impl;

import com.lms.dto.course.CourseResponse;
import com.lms.dto.dashboard.AdminDashboardResponse;
import com.lms.dto.dashboard.InstructorDashboardResponse;
import com.lms.dto.dashboard.StudentDashboardResponse;
import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.dto.user.UserResponse;
import com.lms.entity.*;
import com.lms.exception.ResourceNotFoundException;
import com.lms.mapper.CourseMapper;
import com.lms.mapper.EnrollmentMapper;
import com.lms.mapper.UserMapper;
import com.lms.repository.*;
import com.lms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Override
    public AdminDashboardResponse getAdminDashboardStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);
        long totalCourses = courseRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long totalActiveUsers = userRepository.countByStatus(UserStatus.ACTIVE);

        List<UserResponse> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(UserMapper::toResponse)
                .toList();

        List<CourseResponse> recentCourses = courseRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(c -> {
                    long lessons = lessonRepository.countByCourseCourseId(c.getCourseId());
                    long enrolled = enrollmentRepository.countByCourseCourseId(c.getCourseId());
                    return CourseMapper.toResponse(c, lessons, enrolled);
                })
                .toList();

        List<EnrollmentResponse> recentEnrollments = enrollmentRepository.findTop5ByOrderByEnrollmentDateDesc()
                .stream()
                .map(this::mapToEnrollmentResponse)
                .toList();

        return AdminDashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalInstructors(totalInstructors)
                .totalCourses(totalCourses)
                .totalEnrollments(totalEnrollments)
                .totalActiveUsers(totalActiveUsers)
                .recentUsers(recentUsers)
                .recentCourses(recentCourses)
                .recentEnrollments(recentEnrollments)
                .build();
    }

    @Override
    public InstructorDashboardResponse getInstructorDashboardStats(Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorId));

        long totalCourses = courseRepository.countByInstructor(instructor);
        long totalEnrolled = enrollmentRepository.countByCourseInstructor(instructor);

        List<CourseResponse> recentCourses = courseRepository.findTop5ByInstructorOrderByCreatedAtDesc(instructor)
                .stream()
                .map(c -> {
                    long lessons = lessonRepository.countByCourseCourseId(c.getCourseId());
                    long enrolled = enrollmentRepository.countByCourseCourseId(c.getCourseId());
                    return CourseMapper.toResponse(c, lessons, enrolled);
                })
                .toList();

        long totalPublishedCourses = recentCourses.stream()
                .filter(c -> c.getStatus() == CourseStatus.PUBLISHED)
                .count();

        List<EnrollmentResponse> recentEnrollments = enrollmentRepository.findTop5ByInstructor(
                instructor, PageRequest.of(0, 5)
        ).stream().map(this::mapToEnrollmentResponse).toList();

        return InstructorDashboardResponse.builder()
                .totalCourses(totalCourses)
                .totalPublishedCourses(totalPublishedCourses)
                .totalEnrolledStudents(totalEnrolled)
                .recentCourses(recentCourses)
                .recentEnrollments(recentEnrollments)
                .build();
    }

    @Override
    public StudentDashboardResponse getStudentDashboardStats(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        long totalEnrolled = enrollmentRepository.countByStudent(student);
        long completedCourses = enrollmentRepository.countByStudentAndEnrollmentStatus(student, EnrollmentStatus.COMPLETED);
        long inProgressCourses = enrollmentRepository.countByStudentAndEnrollmentStatus(student, EnrollmentStatus.ACTIVE);
        Double avgProgress = enrollmentRepository.calculateAverageProgressByStudent(student);

        List<EnrollmentResponse> recentEnrollments = enrollmentRepository.findTop5ByStudentOrderByEnrollmentDateDesc(student)
                .stream()
                .map(this::mapToEnrollmentResponse)
                .toList();

        return StudentDashboardResponse.builder()
                .totalEnrolledCourses(totalEnrolled)
                .completedCourses(completedCourses)
                .inProgressCourses(inProgressCourses)
                .averageProgressPercentage(avgProgress != null ? Math.round(avgProgress * 100.0) / 100.0 : 0.0)
                .recentEnrollments(recentEnrollments)
                .build();
    }

    private EnrollmentResponse mapToEnrollmentResponse(Enrollment e) {
        long totalLessons = lessonRepository.countByCourseCourseId(e.getCourse().getCourseId());
        long completedLessons = lessonProgressRepository.countByEnrollmentEnrollmentIdAndIsCompletedTrue(e.getEnrollmentId());
        return EnrollmentMapper.toResponse(e, totalLessons, completedLessons);
    }
}
