import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import enrollmentService from '../../services/enrollmentService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const StudentEnrolledCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({ pageNumber: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEnrollments = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError('');
      const data = await enrollmentService.getMyEnrollments({ page, size: 9 });
      setEnrollments(data.content || []);
      setPagination({
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments(0);
  }, [fetchEnrollments]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Enrolled Courses</h2>
              <p className="text-secondary small mb-0">Total Enrolled Courses: {pagination.totalElements}</p>
            </div>
            <Link to="/courses" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-semibold">
              <i className="bi bi-compass me-2"></i> Browse More Courses
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Fetching your enrolled courses library..." />
          ) : enrollments.length > 0 ? (
            <>
              <div className="row g-4 mb-4">
                {enrollments.map((e) => (
                  <div key={e.enrollmentId} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white d-flex flex-column">
                      <img
                        src={e.courseThumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                        alt={e.courseTitle}
                        className="card-img-top"
                        style={{ height: '160px', objectFit: 'cover' }}
                      />
                      <div className="card-body p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-light text-secondary border">{e.courseCategory}</span>
                          <span
                            className={`badge rounded-pill ${
                              e.enrollmentStatus === 'COMPLETED'
                                ? 'bg-success-subtle text-success border border-success-subtle'
                                : 'bg-primary-subtle text-primary border border-primary-subtle'
                            }`}
                          >
                            {e.enrollmentStatus}
                          </span>
                        </div>

                        <h5 className="fw-bold text-dark mb-2 text-truncate" title={e.courseTitle}>
                          {e.courseTitle}
                        </h5>
                        <p className="small text-muted mb-3">Taught by {e.instructorName}</p>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between small text-secondary mb-1">
                            <span>Progress</span>
                            <span className="fw-bold text-primary">{e.progressPercentage}%</span>
                          </div>
                          <div className="progress mb-3" style={{ height: '6px' }}>
                            <div
                              className={`progress-bar ${e.progressPercentage >= 100 ? 'bg-success' : 'bg-primary'}`}
                              style={{ width: `${e.progressPercentage}%` }}
                            ></div>
                          </div>

                          <Link
                            to={`/courses/${e.courseId}/learn`}
                            className="btn btn-outline-primary w-100 rounded-pill py-2 fw-semibold"
                          >
                            {e.progressPercentage >= 100 ? 'Review Lessons' : 'Continue Course'}{' '}
                            <i className="bi bi-arrow-right ms-1"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                    disabled={pagination.pageNumber === 0}
                    onClick={() => fetchEnrollments(pagination.pageNumber - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-secondary small mx-2">
                    Page {pagination.pageNumber + 1} of {pagination.totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                    disabled={pagination.pageNumber >= pagination.totalPages - 1}
                    onClick={() => fetchEnrollments(pagination.pageNumber + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon="bi-journal-x"
              title="No Enrolled Courses"
              message="You have not enrolled in any courses yet. Discover our top-tier catalog to start learning."
              actionText="Browse Courses"
              actionLink="/courses"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentEnrolledCoursesPage;
