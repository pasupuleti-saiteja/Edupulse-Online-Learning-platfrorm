package com.lms.service;

import com.lms.dto.common.PagedResponse;
import com.lms.dto.enrollment.EnrollmentResponse;
import org.springframework.data.domain.Pageable;

public interface EnrollmentService {

    EnrollmentResponse enrollStudent(Long studentId, Long courseId);

    PagedResponse<EnrollmentResponse> getStudentEnrollments(Long studentId, Pageable pageable);

    PagedResponse<EnrollmentResponse> getCourseEnrollments(Long courseId, Long instructorId, boolean isAdmin, Pageable pageable);

    PagedResponse<EnrollmentResponse> getAllEnrollmentsAdmin(Pageable pageable);

    boolean isStudentEnrolled(Long studentId, Long courseId);

    EnrollmentResponse getEnrollmentById(Long enrollmentId, Long currentUserId, boolean isAdmin);
}
