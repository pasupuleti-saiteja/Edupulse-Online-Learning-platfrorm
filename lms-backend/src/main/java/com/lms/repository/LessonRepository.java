package com.lms.repository;

import com.lms.entity.Course;
import com.lms.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByCourseOrderBySequenceNumberAsc(Course course);

    List<Lesson> findByCourseCourseIdOrderBySequenceNumberAsc(Long courseId);

    long countByCourse(Course course);

    long countByCourseCourseId(Long courseId);

    Optional<Lesson> findByCourseCourseIdAndSequenceNumber(Long courseId, Integer sequenceNumber);

    @Query("SELECT COALESCE(MAX(l.sequenceNumber), 0) FROM Lesson l WHERE l.course.courseId = :courseId")
    Integer findMaxSequenceNumberByCourseId(@Param("courseId") Long courseId);
}
