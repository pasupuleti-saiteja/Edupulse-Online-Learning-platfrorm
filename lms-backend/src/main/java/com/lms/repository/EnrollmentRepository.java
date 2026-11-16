package com.lms.repository;

import com.lms.entity.Course;
import com.lms.entity.Enrollment;
import com.lms.entity.EnrollmentStatus;
import com.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Page<Enrollment> findByStudent(User student, Pageable pageable);

    List<Enrollment> findByStudent(User student);

    Page<Enrollment> findByCourse(Course course, Pageable pageable);

    List<Enrollment> findByCourse(Course course);

    Optional<Enrollment> findByStudentAndCourse(User student, Course course);

    Optional<Enrollment> findByStudentIdAndCourseCourseId(Long studentId, Long courseId);

    Boolean existsByStudentAndCourse(User student, Course course);

    Boolean existsByStudentIdAndCourseCourseId(Long studentId, Long courseId);

    long countByStudent(User student);

    long countByStudentAndEnrollmentStatus(User student, EnrollmentStatus status);

    long countByCourse(Course course);

    long countByCourseCourseId(Long courseId);

    // Total enrolled students across all courses belonging to an instructor
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.instructor = :instructor")
    long countByCourseInstructor(@Param("instructor") User instructor);

    // Instructor enrollment list
    @Query("SELECT e FROM Enrollment e WHERE e.course.instructor = :instructor ORDER BY e.enrollmentDate DESC")
    Page<Enrollment> findByInstructor(@Param("instructor") User instructor, Pageable pageable);

    // Recent enrollments for admin/instructor dashboard
    List<Enrollment> findTop5ByOrderByEnrollmentDateDesc();

    List<Enrollment> findTop5ByStudentOrderByEnrollmentDateDesc(User student);

    @Query("SELECT e FROM Enrollment e WHERE e.course.instructor = :instructor ORDER BY e.enrollmentDate DESC")
    List<Enrollment> findTop5ByInstructor(@Param("instructor") User instructor, Pageable pageable);

    // Overall student average progress percentage
    @Query("SELECT COALESCE(AVG(e.progressPercentage), 0.0) FROM Enrollment e WHERE e.student = :student")
    Double calculateAverageProgressByStudent(@Param("student") User student);
}
