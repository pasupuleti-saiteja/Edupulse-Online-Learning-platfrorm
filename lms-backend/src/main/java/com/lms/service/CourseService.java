package com.lms.service;

import com.lms.dto.common.PagedResponse;
import com.lms.dto.course.CourseRequest;
import com.lms.dto.course.CourseResponse;
import com.lms.entity.CourseLevel;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {

    CourseResponse createCourse(CourseRequest request, Long instructorId);

    CourseResponse updateCourse(Long courseId, CourseRequest request, Long currentUserId, boolean isAdmin);

    void deleteCourse(Long courseId, Long currentUserId, boolean isAdmin);

    CourseResponse getCourseById(Long courseId);

    PagedResponse<CourseResponse> searchPublishedCourses(String query, String category, CourseLevel level, Pageable pageable);

    PagedResponse<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable);

    PagedResponse<CourseResponse> getAllCoursesAdmin(Pageable pageable);

    List<String> getAllCategories();
}
