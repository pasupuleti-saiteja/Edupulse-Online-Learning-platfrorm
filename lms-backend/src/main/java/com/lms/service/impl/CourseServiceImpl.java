package com.lms.service.impl;

import com.lms.dto.common.PagedResponse;
import com.lms.dto.course.CourseRequest;
import com.lms.dto.course.CourseResponse;
import com.lms.entity.Course;
import com.lms.entity.CourseLevel;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.exception.UnauthorizedException;
import com.lms.mapper.CourseMapper;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.UserRepository;
import com.lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    public CourseResponse createCourse(CourseRequest request, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorId));

        if (instructor.getRole() != Role.INSTRUCTOR && instructor.getRole() != Role.ADMIN) {
            throw new BadRequestException("Only Instructors and Administrators can create courses");
        }

        Course course = CourseMapper.toEntity(request, instructor);
        Course saved = courseRepository.save(course);
        return CourseMapper.toResponse(saved, 0, 0);
    }

    @Override
    public CourseResponse updateCourse(Long courseId, CourseRequest request, Long currentUserId, boolean isAdmin) {
        Course course = findCourseById(courseId);
        validateOwnership(course, currentUserId, isAdmin);

        CourseMapper.updateEntity(course, request);
        Course updated = courseRepository.save(course);
        long totalLessons = lessonRepository.countByCourseCourseId(courseId);
        long totalEnrolled = enrollmentRepository.countByCourseCourseId(courseId);
        return CourseMapper.toResponse(updated, totalLessons, totalEnrolled);
    }

    @Override
    public void deleteCourse(Long courseId, Long currentUserId, boolean isAdmin) {
        Course course = findCourseById(courseId);
        validateOwnership(course, currentUserId, isAdmin);
        courseRepository.delete(course);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long courseId) {
        Course course = findCourseById(courseId);
        long totalLessons = lessonRepository.countByCourseCourseId(courseId);
        long totalEnrolled = enrollmentRepository.countByCourseCourseId(courseId);
        return CourseMapper.toResponse(course, totalLessons, totalEnrolled);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> searchPublishedCourses(String query, String category, CourseLevel level, Pageable pageable) {
        Page<Course> page = courseRepository.searchCourses(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                (category != null && !category.trim().isEmpty()) ? category.trim() : null,
                level,
                pageable
        );

        List<CourseResponse> responses = page.getContent().stream()
                .map(c -> {
                    long totalLessons = lessonRepository.countByCourseCourseId(c.getCourseId());
                    long totalEnrolled = enrollmentRepository.countByCourseCourseId(c.getCourseId());
                    return CourseMapper.toResponse(c, totalLessons, totalEnrolled);
                })
                .toList();

        return PagedResponse.of(page, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorId));

        Page<Course> page = courseRepository.findByInstructor(instructor, pageable);
        List<CourseResponse> responses = page.getContent().stream()
                .map(c -> {
                    long totalLessons = lessonRepository.countByCourseCourseId(c.getCourseId());
                    long totalEnrolled = enrollmentRepository.countByCourseCourseId(c.getCourseId());
                    return CourseMapper.toResponse(c, totalLessons, totalEnrolled);
                })
                .toList();

        return PagedResponse.of(page, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CourseResponse> getAllCoursesAdmin(Pageable pageable) {
        Page<Course> page = courseRepository.findAll(pageable);
        List<CourseResponse> responses = page.getContent().stream()
                .map(c -> {
                    long totalLessons = lessonRepository.countByCourseCourseId(c.getCourseId());
                    long totalEnrolled = enrollmentRepository.countByCourseCourseId(c.getCourseId());
                    return CourseMapper.toResponse(c, totalLessons, totalEnrolled);
                })
                .toList();

        return PagedResponse.of(page, responses);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return courseRepository.findDistinctCategories();
    }

    private Course findCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
    }

    private void validateOwnership(Course course, Long currentUserId, boolean isAdmin) {
        if (!isAdmin && !course.getInstructor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You do not have permission to modify this course");
        }
    }
}
