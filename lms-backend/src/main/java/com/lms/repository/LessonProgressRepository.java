package com.lms.repository;

import com.lms.entity.Enrollment;
import com.lms.entity.Lesson;
import com.lms.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByEnrollmentAndLesson(Enrollment enrollment, Lesson lesson);

    Optional<LessonProgress> findByEnrollmentEnrollmentIdAndLessonLessonId(Long enrollmentId, Long lessonId);

    List<LessonProgress> findByEnrollment(Enrollment enrollment);

    List<LessonProgress> findByEnrollmentEnrollmentId(Long enrollmentId);

    long countByEnrollmentAndIsCompletedTrue(Enrollment enrollment);

    long countByEnrollmentEnrollmentIdAndIsCompletedTrue(Long enrollmentId);

    void deleteByEnrollment(Enrollment enrollment);
}
