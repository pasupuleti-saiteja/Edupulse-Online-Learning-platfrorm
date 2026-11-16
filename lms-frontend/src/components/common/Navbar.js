import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'INSTRUCTOR') return '/instructor/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand navbar-brand-custom" to="/">
          <i className="bi bi-mortarboard-fill text-primary"></i>
          <span>EduPulse <span className="text-secondary fw-normal fs-6">LMS</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/courses">
                <i className="bi bi-grid me-1"></i> Browse Courses
              </Link>
            </li>
          </ul>

          {/* Right Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2 border-0 bg-light py-2 px-3 rounded-pill"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}
                  >
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="fw-semibold text-dark text-truncate" style={{ maxWidth: '140px' }}>
                    {user?.fullName}
                  </span>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill ms-1">
                    {user?.role}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2 mt-2 rounded-3" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to={getDashboardPath()}>
                      <i className="bi bi-speedometer2 text-primary"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/profile">
                      <i className="bi bi-person-gear text-secondary"></i> My Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary px-4 py-2 rounded-pill fw-medium shadow-sm">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
