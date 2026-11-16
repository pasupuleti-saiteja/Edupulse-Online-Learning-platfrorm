
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import CourseCard from '../../components/course/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [coursesData, categoriesData] = await Promise.all([
          courseService.getCourses({ page: 0, size: 6, direction: 'desc' }),
          courseService.getCategories(),
        ]);

        setFeaturedCourses(coursesData.content || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-5 border-bottom">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
                🚀 Modern Online Learning Experience
              </span>

              <h1 className="display-4 fw-bold text-dark lh-sm mb-3">
                Unlock Your Potential with{' '}
                <span className="text-primary">EduPulse LMS</span>
              </h1>

              <p className="lead text-secondary mb-4">
                Explore hundreds of cutting-edge software engineering, cloud,
                data science, and UI/UX design courses taught by industry
                veterans. Learn at your own pace with interactive lessons
                and progress tracking.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/courses"
                  className="btn btn-primary px-4 py-3 rounded-pill fw-semibold shadow-sm"
                >
                  <i className="bi bi-compass me-2"></i>
                  Browse All Courses
                </Link>

                <Link
                  to="/register"
                  className="btn btn-outline-secondary px-4 py-3 rounded-pill fw-semibold"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="d-flex align-items-center gap-4 mt-5 pt-3 border-top">
                <div>
                  <h4 className="fw-bold text-dark mb-0">15,000+</h4>
                  <span className="small text-muted">Active Learners</span>
                </div>

                <div className="vr text-muted"></div>

                <div>
                  <h4 className="fw-bold text-dark mb-0">98%</h4>
                  <span className="small text-muted">Completion Rate</span>
                </div>

                <div className="vr text-muted"></div>

                <div>
                  <h4 className="fw-bold text-dark mb-0">4.9 / 5</h4>
                  <span className="small text-muted">Student Rating</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                  alt="Students Learning"
                  className="img-fluid rounded-4 shadow-lg"
                />

                <div
                  className="position-absolute bottom-0 start-0 bg-white p-3 rounded-4 shadow-lg m-3 d-flex align-items-center gap-3 border"
                  style={{ maxWidth: '280px' }}
                >
                  <div className="rounded-circle bg-success-subtle text-success p-3 d-flex align-items-center justify-content-center">
                    <i className="bi bi-award-fill fs-4"></i>
                  </div>

                  <div>
                    <div className="fw-bold text-dark">Verified Progress</div>
                    <div className="small text-muted">
                      Structured curriculum & milestones
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <section className="py-4 bg-light border-bottom">
          <div className="container">
            <div className="d-flex align-items-center gap-2 overflow-auto py-2">

              <span className="fw-semibold text-secondary small text-nowrap me-2">
                Popular Categories:
              </span>

              {categories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/courses?category=${encodeURIComponent(cat)}`}
                  className="badge bg-white text-secondary border px-3 py-2 rounded-pill text-decoration-none hover-primary text-nowrap"
                >
                  {cat}
                </Link>
              ))}

            </div>
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      <section className="py-5">
        <div className="container py-4">

          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="text-primary fw-semibold small text-uppercase">
                Top Curriculums
              </span>

              <h2 className="fw-bold text-dark mb-0">
                Featured Courses
              </h2>
            </div>

            <Link
              to="/courses"
              className="btn btn-outline-primary rounded-pill px-4 fw-medium"
            >
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading top featured courses..." />
          ) : featuredCourses.length > 0 ? (
            <div className="row g-4">
              {featuredCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="col-12 col-md-6 col-lg-4"
                >
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">
                No courses currently available.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">

          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Why Choose EduPulse?</h2>
            <p className="text-secondary">
              Designed with enterprise architecture principles and pedagogical rigor
            </p>
          </div>

          <div className="row g-4">

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 p-4 rounded-4 bg-light">
                <div
                  className="rounded-circle bg-primary-subtle text-primary p-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className="bi bi-code-slash fs-4"></i>
                </div>

                <h5 className="fw-bold text-dark">
                  Production-Ready Code
                </h5>

                <p className="text-secondary small mb-0">
                  Curriculums build genuine full-stack applications with
                  Spring Boot 3, Spring Security 6, JWT, and React 18.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 p-4 rounded-4 bg-light">
                <div
                  className="rounded-circle bg-success-subtle text-success p-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className="bi bi-graph-up fs-4"></i>
                </div>

                <h5 className="fw-bold text-dark">
                  Dynamic Learning Progress
                </h5>

                <p className="text-secondary small mb-0">
                  Automated tracking marks lessons as completed and computes
                  real-time percentage progression toward completion.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 p-4 rounded-4 bg-light">
                <div
                  className="rounded-circle bg-warning-subtle text-warning p-3 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '56px', height: '56px' }}
                >
                  <i className="bi bi-shield-check fs-4"></i>
                </div>

                <h5 className="fw-bold text-dark">
                  Enterprise Security
                </h5>

                <p className="text-secondary small mb-0">
                  Role-based access controls for Admins, Instructors, and
                  Students ensure strict governance and data protection.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
