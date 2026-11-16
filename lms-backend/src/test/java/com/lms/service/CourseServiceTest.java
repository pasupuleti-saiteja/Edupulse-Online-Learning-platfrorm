package com.lms.service;

import com.lms.dto.course.CourseRequest;
import com.lms.dto.course.CourseResponse;
import com.lms.entity.*;
import com.lms.exception.BadRequestException;
import com.lms.exception.UnauthorizedException;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.UserRepository;
import com.lms.service.impl.CourseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private User instructor;
    private User otherInstructor;
    private Course course;
    private CourseRequest courseRequest;

    @BeforeEach
    void setUp() {
        instructor = User.builder()
                .id(2L)
                .fullName("Dr. John Doe")
                .email("john.doe@lms.com")
                .role(Role.INSTRUCTOR)
                .status(UserStatus.ACTIVE)
                .build();

        otherInstructor = User.builder()
                .id(3L)
                .fullName("Prof. Jane Smith")
                .email("jane.smith@lms.com")
                .role(Role.INSTRUCTOR)
                .status(UserStatus.ACTIVE)
                .build();

        course = Course.builder()
                .courseId(1L)
                .title("Full Stack Java")
                .description("Course description")
                .category("Development")
                .instructor(instructor)
                .price(new BigDecimal("99.99"))
                .level(CourseLevel.INTERMEDIATE)
                .status(CourseStatus.PUBLISHED)
                .build();

        courseRequest = CourseRequest.builder()
                .title("Full Stack Java")
                .description("Course description")
                .category("Development")
                .price(new BigDecimal("99.99"))
                .level(CourseLevel.INTERMEDIATE)
                .status(CourseStatus.PUBLISHED)
                .build();
    }

    @Test
    @DisplayName("Should successfully create course when user is an Instructor")
    void createCourse_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(instructor));
        when(courseRepository.save(any(Course.class))).thenReturn(course);

        CourseResponse response = courseService.createCourse(courseRequest, 2L);

        assertNotNull(response);
        assertEquals("Full Stack Java", response.getTitle());
        assertEquals(instructor.getId(), response.getInstructorId());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when a STUDENT attempts to create course")
    void createCourse_ByStudent_ThrowsException() {
        User student = User.builder().id(4L).role(Role.STUDENT).build();
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));

        assertThrows(BadRequestException.class, () -> courseService.createCourse(courseRequest, 4L));
        verify(courseRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when instructor tries to modify another instructor's course")
    void updateCourse_UnauthorizedInstructor_ThrowsException() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        // otherInstructor (ID 3) trying to edit course owned by instructor (ID 2)
        assertThrows(UnauthorizedException.class, () ->
                courseService.updateCourse(1L, courseRequest, otherInstructor.getId(), false)
        );
        verify(courseRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should allow Admin to update any instructor's course")
    void updateCourse_ByAdmin_Success() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(lessonRepository.countByCourseCourseId(1L)).thenReturn(4L);
        when(enrollmentRepository.countByCourseCourseId(1L)).thenReturn(10L);

        // Current user ID 999 (Admin), isAdmin = true
        CourseResponse response = courseService.updateCourse(1L, courseRequest, 999L, true);

        assertNotNull(response);
        verify(courseRepository, times(1)).save(course);
    }
}
