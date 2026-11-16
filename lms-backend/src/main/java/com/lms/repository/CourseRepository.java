package com.lms.repository;

import com.lms.entity.Course;
import com.lms.entity.CourseLevel;
import com.lms.entity.CourseStatus;
import com.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    Page<Course> findByInstructor(User instructor, Pageable pageable);

    List<Course> findByInstructor(User instructor);

    long countByInstructor(User instructor);

    long countByStatus(CourseStatus status);

    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.status = 'PUBLISHED' ORDER BY c.category ASC")
    List<String> findDistinctCategories();

    // Multi-faceted search: title/description keyword, category, and difficulty level
    @Query("SELECT c FROM Course c WHERE " +
           "c.status = 'PUBLISHED' AND " +
           "(:query IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:level IS NULL OR c.level = :level)")
    Page<Course> searchCourses(
            @Param("query") String query,
            @Param("category") String category,
            @Param("level") CourseLevel level,
            Pageable pageable
    );

    // Latest courses for dashboards
    List<Course> findTop5ByOrderByCreatedAtDesc();

    List<Course> findTop5ByInstructorOrderByCreatedAtDesc(User instructor);
}
