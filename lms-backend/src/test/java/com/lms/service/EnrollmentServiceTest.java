package com.lms.service;

import com.lms.dto.enrollment.EnrollmentResponse;
import com.lms.entity.*;
import com.lms.exception.BadRequestException;
import com.lms.repository.CourseRepository;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.UserRepository;
import com.lms.service.impl.EnrollmentServiceImpl;
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
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private EnrollmentServiceImpl enrollmentService;

    private User student;
    private User instructor;
    private Course publishedCourse;
    private Course draftCourse;
    private Enrollment savedEnrollment;

    @BeforeEach
    void setUp() {
        student = User.builder().id(4L).fullName("Alice Johnson").status(UserStatus.ACTIVE).role(Role.STUDENT).build();
        instructor = User.builder().id(2L).fullName("Dr. John Doe").status(UserStatus.ACTIVE).role(Role.INSTRUCTOR).build();

        publishedCourse = Course.builder()
                .courseId(1L)
                .title("Full Stack Java")
                .instructor(instructor)
                .status(CourseStatus.PUBLISHED)
                .build();

        draftCourse = Course.builder()
                .courseId(2L)
                .title("Advanced MySQL")
                .instructor(instructor)
                .status(CourseStatus.DRAFT)
                .build();

        savedEnrollment = Enrollment.builder()
                .enrollmentId(10L)
                .student(student)
                .course(publishedCourse)
                .enrollmentStatus(EnrollmentStatus.ACTIVE)
                .progressPercentage(BigDecimal.ZERO)
                .build();
    }

    @Test
    @DisplayName("Should successfully enroll student in published course")
    void enrollStudent_Success() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(publishedCourse));
        when(enrollmentRepository.existsByStudentAndCourse(student, publishedCourse)).thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(savedEnrollment);
        when(lessonRepository.countByCourseCourseId(1L)).thenReturn(4L);

        EnrollmentResponse response = enrollmentService.enrollStudent(4L, 1L);

        assertNotNull(response);
        assertEquals(student.getId(), response.getStudentId());
        assertEquals(publishedCourse.getCourseId(), response.getCourseId());
        verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when attempting to enroll in DRAFT course")
    void enrollStudent_DraftCourse_ThrowsException() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(draftCourse));

        assertThrows(BadRequestException.class, () -> enrollmentService.enrollStudent(4L, 2L));
        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException on duplicate enrollment")
    void enrollStudent_DuplicateEnrollment_ThrowsException() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(publishedCourse));
        when(enrollmentRepository.existsByStudentAndCourse(student, publishedCourse)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> enrollmentService.enrollStudent(4L, 1L));
        verify(enrollmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BadRequestException when instructor tries to enroll in own course")
    void enrollStudent_InstructorSelfEnroll_ThrowsException() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(instructor));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(publishedCourse));

        assertThrows(BadRequestException.class, () -> enrollmentService.enrollStudent(2L, 1L));
        verify(enrollmentRepository, never()).save(any());
    }
}
