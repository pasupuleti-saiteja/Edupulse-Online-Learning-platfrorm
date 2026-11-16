import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, actionButton }) => {
  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-success text-white';
      case 'INTERMEDIATE':
        return 'bg-primary text-white';
      case 'ADVANCED':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  // Format course price in Indian Rupees (INR)
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  };

  const defaultThumbnail =
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="course-card">
      <div className="course-card-img-wrapper">
        <img
          src={course.thumbnail || defaultThumbnail}
          alt={course.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultThumbnail;
          }}
        />

        <span
          className={`course-badge-level ${getLevelBadgeClass(course.level)}`}
        >
          {course.level}
        </span>

        <span className="course-badge-category">
          <i className="bi bi-tag-fill me-1"></i>
          {course.category}
        </span>
      </div>

      <div className="course-card-body">
        <h5 className="course-card-title" title={course.title}>
          <Link
            to={`/courses/${course.courseId}`}
            className="text-decoration-none text-dark hover-primary"
          >
            {course.title}
          </Link>
        </h5>

        <p className="course-card-desc">{course.description}</p>

        <div className="d-flex align-items-center gap-2 mb-3 text-secondary small">
          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-person-circle text-primary"></i>
            <span
              className="text-truncate"
              style={{ maxWidth: '130px' }}
            >
              {course.instructorName}
            </span>
          </div>

          <span>&bull;</span>

          <div className="d-flex align-items-center gap-1">
            <i className="bi bi-clock"></i>
            <span>{course.duration || 'Self-paced'}</span>
          </div>
        </div>

        <div className="course-card-footer">
          <div>
            <span className="course-price">
              {course.price != null && Number(course.price) > 0
                ? formatINR(course.price)
                : 'FREE'}
            </span>
          </div>

          <div>
            {actionButton ? (
              actionButton
            ) : (
              <Link
                to={`/courses/${course.courseId}`}
                className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium"
              >
                View Course
                <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;