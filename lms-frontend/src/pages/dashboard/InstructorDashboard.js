import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructorStats();
  }, []);

  const fetchInstructorStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getInstructorStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch instructor statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-1">Instructor Studio</h2>
              <p className="text-secondary small mb-0">Manage your course catalog, track students, and add lessons</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/instructor/courses/create" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-semibold">
                <i className="bi bi-plus-circle me-2"></i> Create New Course
              </Link>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading your teaching metrics..." />
          ) : stats ? (
            <>
              {/* Metric Cards Grid */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.totalCourses}</div>
                        <div className="metric-label">Total Courses Created</div>
                      </div>
                      <div className="metric-icon-box bg-primary-subtle text-primary">
                        <i className="bi bi-journal-code"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.totalPublishedCourses}</div>
                        <div className="metric-label">Published Courses</div>
                      </div>
                      <div className="metric-icon-box bg-success-subtle text-success">
                        <i className="bi bi-check-circle-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.totalEnrolledStudents}</div>
                        <div className="metric-label">Total Enrolled Students</div>
                      </div>
                      <div className="metric-icon-box bg-info-subtle text-info">
                        <i className="bi bi-people-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Catalog & Recent Enrollments */}
              <div className="row g-4">
                {/* Recent Authored Courses */}
                <div className="col-12 col-lg-7">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold text-dark mb-0">My Active Courses</h5>
                      <Link to="/instructor/courses" className="small text-primary fw-semibold text-decoration-none">
                        View All Courses
                      </Link>
                    </div>
                    <div className="card-body p-4">
                      {stats.recentCourses && stats.recentCourses.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {stats.recentCourses.map((course) => (
                            <div key={course.courseId} className="border rounded-3 p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={course.thumbnail || 'https://via.placeholder.com/60'}
                                  alt={course.title}
                                  className="rounded-3"
                                  style={{ width: '60px', height: '45px', objectFit: 'cover' }}
                                />
                                <div>
                                  <h6 className="fw-bold text-dark mb-1">{course.title}</h6>
                                  <div className="small text-secondary d-flex gap-2 align-items-center">
                                    <span className={`badge ${course.status === 'PUBLISHED' ? 'bg-success' : 'bg-secondary'}`}>
                                      {course.status}
                                    </span>
                                    <span>&bull;</span>
                                    <span>{course.totalLessons} Lessons</span>
                                    <span>&bull;</span>
                                    <span>{course.totalEnrolledStudents} Students</span>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <Link to={`/instructor/courses/${course.courseId}/lessons`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                                  <i className="bi bi-list-task me-1"></i> Lessons
                                </Link>
                                <Link to={`/instructor/courses/${course.courseId}/edit`} className="btn btn-light btn-sm rounded-pill px-3">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <i className="bi bi-journal-plus fs-1 text-muted"></i>
                          <p className="mt-2 text-secondary">You haven't authored any courses yet.</p>
                          <Link to="/instructor/courses/create" className="btn btn-primary rounded-pill btn-sm px-4">
                            Create First Course
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Student Enrollments */}
                <div className="col-12 col-lg-5">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold text-dark mb-0">Recent Student Enrollments</h5>
                      <Link to="/instructor/enrollments" className="small text-primary fw-semibold text-decoration-none">
                        View All
                      </Link>
                    </div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="ps-4">Student</th>
                              <th>Course</th>
                              <th className="pe-4 text-end">Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.recentEnrollments && stats.recentEnrollments.length > 0 ? (
                              stats.recentEnrollments.map((e) => (
                                <tr key={e.enrollmentId}>
                                  <td className="ps-4">
                                    <div className="fw-semibold text-dark">{e.studentName}</div>
                                    <div className="small text-muted">{e.studentEmail}</div>
                                  </td>
                                  <td>
                                    <span className="small text-dark text-truncate d-inline-block" style={{ maxWidth: '140px' }} title={e.courseTitle}>
                                      {e.courseTitle}
                                    </span>
                                  </td>
                                  <td className="pe-4 text-end">
                                    <span className="badge bg-primary-subtle text-primary rounded-pill">
                                      {e.progressPercentage}%
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="text-center py-4 text-muted">No student enrollments yet</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
