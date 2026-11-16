package com.lms.service;

import com.lms.dto.progress.CourseProgressResponse;
import com.lms.entity.*;
import com.lms.exception.UnauthorizedException;
import com.lms.repository.EnrollmentRepository;
import com.lms.repository.LessonProgressRepository;
import com.lms.repository.LessonRepository;
import com.lms.service.impl.ProgressServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private LessonProgressRepository lessonProgressRepository;

    @InjectMocks
    private ProgressServiceImpl progressService;

    private User student;
    private Course course;
    private Lesson lesson1;
    private Lesson lesson2;
    private Enrollment enrollment;

    @BeforeEach
    void setUp() {
        student = User.builder().id(4L).fullName("Alice Johnson").role(Role.STUDENT).build();
        course = Course.builder().courseId(1L).title("Full Stack Java").build();

        lesson1 = Lesson.builder().lessonId(101L).course(course).sequenceNumber(1).title("Lesson 1").build();
        lesson2 = Lesson.builder().lessonId(102L).course(course).sequenceNumber(2).title("Lesson 2").build();

        enrollment = Enrollment.builder()
                .enrollmentId(50L)
                .student(student)
                .course(course)
                .enrollmentStatus(EnrollmentStatus.ACTIVE)
                .progressPercentage(BigDecimal.ZERO)
                .build();
    }

    @Test
    @DisplayName("Should mark lesson completed and calculate 50% progress for 1 out of 2 lessons")
    void markLessonCompleted_PartialProgress() {
        when(lessonRepository.findById(101L)).thenReturn(Optional.of(lesson1));
        when(enrollmentRepository.findByStudentIdAndCourseCourseId(4L, 1L)).thenReturn(Optional.of(enrollment));
        when(lessonProgressRepository.findByEnrollmentEnrollmentIdAndLessonLessonId(50L, 101L)).thenReturn(Optional.empty());

        when(lessonRepository.countByCourseCourseId(1L)).thenReturn(2L);
        when(lessonProgressRepository.countByEnrollmentEnrollmentIdAndIsCompletedTrue(50L)).thenReturn(1L);
        when(lessonRepository.findByCourseOrderBySequenceNumberAsc(course)).thenReturn(List.of(lesson1, lesson2));

        CourseProgressResponse response = progressService.markLessonCompleted(101L, 4L);

        assertNotNull(response);
        assertEquals(new BigDecimal("50.00"), response.getProgressPercentage());
        assertEquals(EnrollmentStatus.ACTIVE, enrollment.getEnrollmentStatus());
        assertFalse(response.getIsFullyCompleted());
        verify(lessonProgressRepository, times(1)).save(any(LessonProgress.class));
        verify(enrollmentRepository, times(1)).save(enrollment);
    }

    @Test
    @DisplayName("Should update enrollmentStatus to COMPLETED when 100% progress achieved")
    void markLessonCompleted_AllLessonsDone_TransitionsStatus() {
        when(lessonRepository.findById(102L)).thenReturn(Optional.of(lesson2));
        when(enrollmentRepository.findByStudentIdAndCourseCourseId(4L, 1L)).thenReturn(Optional.of(enrollment));
        when(lessonProgressRepository.findByEnrollmentEnrollmentIdAndLessonLessonId(50L, 102L)).thenReturn(Optional.empty());

        when(lessonRepository.countByCourseCourseId(1L)).thenReturn(2L);
        when(lessonProgressRepository.countByEnrollmentEnrollmentIdAndIsCompletedTrue(50L)).thenReturn(2L); // All 2 completed
        when(lessonRepository.findByCourseOrderBySequenceNumberAsc(course)).thenReturn(List.of(lesson1, lesson2));

        CourseProgressResponse response = progressService.markLessonCompleted(102L, 4L);

        assertNotNull(response);
        assertEquals(new BigDecimal("100.00"), response.getProgressPercentage());
        assertEquals(EnrollmentStatus.COMPLETED, enrollment.getEnrollmentStatus());
        assertTrue(response.getIsFullyCompleted());
        verify(enrollmentRepository, times(1)).save(enrollment);
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when student is not enrolled in course")
    void markLessonCompleted_NotEnrolled_ThrowsException() {
        when(lessonRepository.findById(101L)).thenReturn(Optional.of(lesson1));
        when(enrollmentRepository.findByStudentIdAndCourseCourseId(4L, 1L)).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> progressService.markLessonCompleted(101L, 4L));
        verify(lessonProgressRepository, never()).save(any());
    }
}
