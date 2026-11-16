import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentStats();
  }, []);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getStudentStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch student learning metrics');
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
              <h2 className="fw-bold text-dark mb-1">My Learning Hub</h2>
              <p className="text-secondary small mb-0">Track your progress, resume ongoing courses, and master new skills</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/courses" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-semibold">
                <i className="bi bi-compass me-2"></i> Explore More Courses
              </Link>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Calculating your learning progress..." />
          ) : stats ? (
            <>
              {/* Metric Cards Grid */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.totalEnrolledCourses}</div>
                        <div className="metric-label">Enrolled Courses</div>
                      </div>
                      <div className="metric-icon-box bg-primary-subtle text-primary">
                        <i className="bi bi-journal-check"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.completedCourses}</div>
                        <div className="metric-label">Completed Courses</div>
                      </div>
                      <div className="metric-icon-box bg-success-subtle text-success">
                        <i className="bi bi-trophy-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.inProgressCourses}</div>
                        <div className="metric-label">In-Progress Courses</div>
                      </div>
                      <div className="metric-icon-box bg-warning-subtle text-warning">
                        <i className="bi bi-hourglass-split"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">{stats.averageProgressPercentage}%</div>
                        <div className="metric-label">Avg. Progress Rate</div>
                      </div>
                      <div className="metric-icon-box bg-info-subtle text-info">
                        <i className="bi bi-graph-up-arrow"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Overview Banner */}
              <div className="card border-0 shadow-sm rounded-4 mb-4 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-dark">Overall Curriculum Completion</span>
                  <span className="fw-bold text-primary">{stats.averageProgressPercentage}%</span>
                </div>
                <div className="progress" style={{ height: '10px' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                    role="progressbar"
                    style={{ width: `${stats.averageProgressPercentage}%` }}
                    aria-valuenow={stats.averageProgressPercentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>

              {/* Active Enrolled Courses */}
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold text-dark mb-0">Continue Learning</h5>
                  <Link to="/student/enrolled" className="small text-primary fw-semibold text-decoration-none">
                    View All Enrolled
                  </Link>
                </div>
                <div className="card-body p-4">
                  {stats.recentEnrollments && stats.recentEnrollments.length > 0 ? (
                    <div className="row g-4">
                      {stats.recentEnrollments.map((e) => (
                        <div key={e.enrollmentId} className="col-12 col-md-6">
                          <div className="border rounded-4 p-3 d-flex flex-column h-100 bg-white shadow-sm">
                            <div className="d-flex gap-3 mb-3">
                              <img
                                src={e.courseThumbnail || 'https://via.placeholder.com/80'}
                                alt={e.courseTitle}
                                className="rounded-3"
                                style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                              />
                              <div className="flex-grow-1 overflow-hidden">
                                <span className="badge bg-light text-secondary border mb-1">{e.courseCategory}</span>
                                <h6 className="fw-bold text-dark mb-1 text-truncate" title={e.courseTitle}>
                                  {e.courseTitle}
                                </h6>
                                <p className="small text-muted mb-0">Instructor: {e.instructorName}</p>
                              </div>
                            </div>

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
                                className="btn btn-outline-primary btn-sm w-100 rounded-pill fw-medium"
                              >
                                {e.progressPercentage >= 100 ? 'Review Course' : 'Resume Lesson'}{' '}
                                <i className="bi bi-play-circle ms-1"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-book fs-1 text-muted"></i>
                      <p className="mt-2 text-secondary">You haven't enrolled in any courses yet.</p>
                      <Link to="/courses" className="btn btn-primary rounded-pill btn-sm px-4 shadow-sm">
                        Browse Course Catalog
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
