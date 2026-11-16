
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import lessonService from '../../services/lessonService';
import enrollmentService from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Format course price in Indian Rupees
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  };

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const courseData = await courseService.getCourseById(id);
      setCourse(courseData);

      // Check if student is already enrolled
      if (isAuthenticated && user?.role === 'STUDENT') {
        try {
          const myEnrollments = await enrollmentService.getMyEnrollments({
            page: 0,
            size: 50
          });

          const enrolled = myEnrollments.content?.some(
            (e) => e.courseId === Number(id)
          );

          setIsEnrolled(enrolled);

          if (enrolled) {
            const lessonsData = await lessonService.getLessonsByCourse(id);
            setLessons(lessonsData || []);
          }
        } catch (enrollErr) {
          console.warn('Could not check enrollment state:', enrollErr);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, user?.role]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: `/courses/${id}` } }
      });
      return;
    }

    setEnrollLoading(true);
    setError('');

    try {
      await enrollmentService.enroll(course.courseId);
      setSuccess(
        'Successfully enrolled in course! Launching learning environment...'
      );
      setIsEnrolled(true);

      setTimeout(() => {
        navigate(`/courses/${id}/learn`);
      }, 1200);
    } catch (err) {
      setError(
        err.message || 'Enrollment failed. You might already be enrolled.'
      );
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading course curriculum..." />;
  }

  if (error && !course) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger py-3 px-4 d-inline-block rounded-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>

        <div className="mt-3">
          <Link
            to="/courses"
            className="btn btn-primary rounded-pill px-4"
          >
            Back to Course Catalog
          </Link>
        </div>
      </div>
    );
  }

  const defaultThumbnail =
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';

  return (
    <div>
      {/* Course Header Banner */}
      <section className="bg-dark text-white py-5">
        <div className="container py-3">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb small mb-3">
                  <li className="breadcrumb-item">
                    <Link
                      to="/"
                      className="text-secondary text-decoration-none"
                    >
                      Home
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <Link
                      to="/courses"
                      className="text-secondary text-decoration-none"
                    >
                      Courses
                    </Link>
                  </li>

                  <li
                    className="breadcrumb-item active text-white"
                    aria-current="page"
                  >
                    {course.category}
                  </li>
                </ol>
              </nav>

              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary px-3 py-2 rounded-pill">
                  {course.category}
                </span>

                <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                  {course.level}
                </span>
              </div>

              <h1 className="fw-bold display-6 mb-3">
                {course.title}
              </h1>

              <p className="lead text-light opacity-75 mb-4">
                {course.description}
              </p>

              <div className="d-flex align-items-center gap-4 flex-wrap small text-light opacity-75">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                  <span>
                    Instructor:{' '}
                    <strong className="text-white">
                      {course.instructorName}
                    </strong>
                  </span>
                </div>

                <div>
                  <i className="bi bi-clock me-1 text-primary"></i>
                  <span>
                    Duration: {course.duration || 'Flexible'}
                  </span>
                </div>

                <div>
                  <i className="bi bi-journal-text me-1 text-primary"></i>
                  <span>{course.totalLessons} Lessons</span>
                </div>

                <div>
                  <i className="bi bi-people me-1 text-primary"></i>
                  <span>
                    {course.totalEnrolledStudents} Students Enrolled
                  </span>
                </div>
              </div>
            </div>

            {/* Enrollment Action Card */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white text-dark">
                <img
                  src={course.thumbnail || defaultThumbnail}
                  alt={course.title}
                  className="card-img-top"
                  style={{
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />

                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-secondary small">
                      Course Pricing:
                    </span>

                    <h3 className="fw-bold text-primary mb-0">
                      {Number(course.price) > 0
                        ? formatINR(course.price)
                        : 'FREE'}
                    </h3>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 small mb-3 rounded-3">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success py-2 small mb-3 rounded-3">
                      {success}
                    </div>
                  )}

                  {/* Actions based on role and enrollment */}
                  {isEnrolled ? (
                    <Link
                      to={`/courses/${course.courseId}/learn`}
                      className="btn btn-success w-100 py-3 rounded-pill fw-semibold shadow-sm mb-2"
                    >
                      <i className="bi bi-play-circle-fill me-2"></i>
                      Go to Lesson Player
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrollLoading}
                      className="btn btn-primary w-100 py-3 rounded-pill fw-semibold shadow-sm mb-2"
                    >
                      {enrollLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing Enrollment...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-lightning-charge-fill me-1"></i>
                          Enroll in Course Now
                        </>
                      )}
                    </button>
                  )}

                  <ul className="list-unstyled small text-secondary mt-3 mb-0 d-flex flex-column gap-2">
                    <li className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      Full lifetime curriculum access
                    </li>

                    <li className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      Real-time lesson progress tracking
                    </li>

                    <li className="d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i>
                      Self-paced video & reading modules
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum & Syllabus Section */}
      <section className="py-5 bg-light">
        <div className="container py-3">
          <div className="row">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
                <h4 className="fw-bold text-dark mb-3">
                  Course Curriculum
                </h4>

                <p className="text-secondary small mb-4">
                  {course.totalLessons} Lessons structured sequentially
                  to guide your mastery.
                </p>

                {isEnrolled && lessons.length > 0 ? (
                  <div className="list-group list-group-flush border rounded-3 overflow-hidden">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.lessonId}
                        className="list-group-item d-flex justify-content-between align-items-center p-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-light text-secondary border rounded-pill">
                            Lesson {lesson.sequenceNumber}
                          </span>

                          <div>
                            <h6 className="fw-semibold text-dark mb-0">
                              {lesson.title}
                            </h6>

                            <span className="small text-muted">
                              {lesson.duration || 'Self-paced'}
                            </span>
                          </div>
                        </div>

                        {lesson.isCompleted ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                            <i className="bi bi-check2-circle me-1"></i>
                            Completed
                          </span>
                        ) : (
                          <Link
                            to={`/courses/${course.courseId}/learn?lesson=${lesson.lessonId}`}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          >
                            Play <i className="bi bi-play ms-1"></i>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-light p-4 rounded-3 text-center border">
                    <i className="bi bi-lock-fill text-muted fs-3 mb-2 d-block"></i>

                    <h6 className="fw-bold text-dark">
                      Enroll to Unlock Full Curriculum
                    </h6>

                    <p className="text-secondary small mb-3">
                      Join this course to access interactive video lessons,
                      markdown source notes, and progress tracking.
                    </p>

                    {!isAuthenticated && (
                      <Link
                        to="/login"
                        className="btn btn-primary rounded-pill px-4 btn-sm"
                      >
                        Sign In to Enroll
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailsPage;
