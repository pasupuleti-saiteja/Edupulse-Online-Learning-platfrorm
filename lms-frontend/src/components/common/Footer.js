import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top mt-auto py-4">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <i className="bi bi-mortarboard-fill text-primary fs-5"></i>
              <span className="fw-bold fs-5 text-dark">EduPulse LMS</span>
            </div>
            <p className="text-secondary small mb-0">
              Enterprise Online Learning Management System built with Spring Boot 3 & React 18.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 mb-2">
              <Link to="/courses" className="text-decoration-none text-secondary small hover-primary">
                Courses
              </Link>
              <Link to="/login" className="text-decoration-none text-secondary small hover-primary">
                Sign In
              </Link>
              <Link to="/register" className="text-decoration-none text-secondary small hover-primary">
                Register
              </Link>
            </div>
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} EduPulse Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
