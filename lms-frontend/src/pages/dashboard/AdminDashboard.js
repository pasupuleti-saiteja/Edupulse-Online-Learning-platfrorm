
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await dashboardService.getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin dashboard statistics');
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
              <h2 className="fw-bold text-dark mb-1">
                Platform Administration
              </h2>
              <p className="text-secondary small mb-0">
                Overview of platform health, users, courses, and enrollments
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={fetchDashboardStats}
                className="btn btn-outline-secondary rounded-pill px-3 py-2 btn-sm"
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh Data
              </button>

              <Link
                to="/admin/courses"
                className="btn btn-primary rounded-pill px-3 py-2 btn-sm shadow-sm"
              >
                <i className="bi bi-collection-play me-1"></i>
                Manage Courses
              </Link>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Calculating platform statistics..." />
          ) : stats ? (
            <>
              {/* Metric Cards Grid */}
              <div className="row g-4 mb-4">

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">
                          {stats.totalStudents}
                        </div>
                        <div className="metric-label">Total Students</div>
                      </div>

                      <div className="metric-icon-box bg-primary-subtle text-primary">
                        <i className="bi bi-mortarboard-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">
                          {stats.totalInstructors}
                        </div>
                        <div className="metric-label">Active Instructors</div>
                      </div>

                      <div className="metric-icon-box bg-info-subtle text-info">
                        <i className="bi bi-person-badge-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">
                          {stats.totalCourses}
                        </div>
                        <div className="metric-label">Platform Courses</div>
                      </div>

                      <div className="metric-icon-box bg-success-subtle text-success">
                        <i className="bi bi-collection-play-fill"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="metric-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="metric-number">
                          {stats.totalEnrollments}
                        </div>
                        <div className="metric-label">Course Enrollments</div>
                      </div>

                      <div className="metric-icon-box bg-warning-subtle text-warning">
                        <i className="bi bi-card-checklist"></i>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Tables Grid */}
              <div className="row g-4">

                {/* Recent Registrations */}
                <div className="col-12 col-lg-7">
                  <div className="card border-0 shadow-sm rounded-4 h-100">

                    <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold text-dark mb-0">
                        Recent User Registrations
                      </h5>

                      <Link
                        to="/admin/students"
                        className="small text-primary fw-semibold text-decoration-none"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="ps-4">User</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th className="pe-4 text-end">Registered</th>
                            </tr>
                          </thead>

                          <tbody>
                            {stats.recentUsers && stats.recentUsers.length > 0 ? (
                              stats.recentUsers.map((u) => (
                                <tr key={u.id}>
                                  <td className="ps-4">
                                    <div className="fw-semibold text-dark">
                                      {u.fullName}
                                    </div>
                                    <div className="small text-muted">
                                      {u.email}
                                    </div>
                                  </td>

                                  <td>
                                    <span className={`badge rounded-pill ${u.role === 'INSTRUCTOR' ? 'bg-info-subtle text-info' : 'bg-primary-subtle text-primary'}`}>
                                      {u.role}
                                    </span>
                                  </td>

                                  <td>
                                    <span className={`badge rounded-pill ${u.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                      {u.status}
                                    </span>
                                  </td>

                                  <td className="pe-4 text-end text-secondary small">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center py-4 text-muted">
                                  No recent registrations found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Courses */}
                <div className="col-12 col-lg-5">
                  <div className="card border-0 shadow-sm rounded-4 h-100">

                    <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold text-dark mb-0">
                        Latest Courses
                      </h5>

                      <Link
                        to="/admin/courses"
                        className="small text-primary fw-semibold text-decoration-none"
                      >
                        Manage
                      </Link>
                    </div>

                    <div className="card-body px-4 py-3">
                      <div className="d-flex flex-column gap-3">

                        {stats.recentCourses && stats.recentCourses.length > 0 ? (
                          stats.recentCourses.map((c) => (
                            <div
                              key={c.courseId}
                              className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg"
                            >
                              <img
                                src={c.thumbnail || 'https://via.placeholder.com/60'}
                                alt={c.title}
                                className="rounded-3"
                                style={{
                                  width: '56px',
                                  height: '42px',
                                  objectFit: 'cover',
                                }}
                              />

                              <div className="flex-grow-1 overflow-hidden">
                                <h6
                                  className="fw-bold text-dark mb-1 text-truncate"
                                  title={c.title}
                                >
                                  {c.title}
                                </h6>

                                <div className="small text-muted d-flex gap-2">
                                  <span>{c.instructorName}</span>
                                  <span>&bull;</span>

                                  <span className="text-primary fw-semibold">
                                    {Number(c.price) > 0
                                      ? formatINR(c.price)
                                      : 'FREE'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted">
                            No courses created yet
                          </div>
                        )}

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

export default AdminDashboard;
