import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center min-vh-75 d-flex flex-column align-items-center justify-content-center">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 className="fw-bold text-dark mb-3">Page Not Found</h3>
        <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '450px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm">
            <i className="bi bi-house-door me-2"></i> Return Home
          </Link>
          <Link to="/courses" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
