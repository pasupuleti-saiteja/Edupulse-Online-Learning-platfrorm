
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import EmptyState from '../../components/common/EmptyState';

// Format course prices in Indian Rupees (INR)
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchCourses = useCallback(async (page = 0) => {
    try {
      setLoading(true);
      setError('');

      const data = await courseService.getCourses({
        page,
        size: 10
      });

      setCourses(data.content || []);

      setPagination({
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });

    } catch (err) {
      setError(err.message || 'Failed to fetch platform courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(0);
  }, [fetchCourses]);

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    setModalLoading(true);

    try {
      await courseService.deleteCourse(selectedCourse.courseId);

      setSuccess(
        `Course '${selectedCourse.title}' deleted successfully`
      );

      setSelectedCourse(null);

      fetchCourses(pagination.pageNumber);

    } catch (err) {
      setError(err.message || 'Failed to delete course');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Admin Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">

          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-1">
                Manage Platform Courses
              </h2>

              <p className="text-secondary small mb-0">
                Total Courses: {pagination.totalElements}
              </p>
            </div>

            <Link
              to="/instructor/courses/create"
              className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-semibold"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Course
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show rounded-3 py-2"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}

              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              className="alert alert-success alert-dismissible fade show rounded-3 py-2"
              role="alert"
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}

              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess('')}
              ></button>
            </div>
          )}

          {/* Courses Table */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-body p-0">

              {loading ? (
                <LoadingSpinner message="Fetching all platform courses..." />
              ) : courses.length > 0 ? (

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">

                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Course</th>
                        <th>Category</th>
                        <th>Instructor</th>
                        <th>Price (INR)</th>
                        <th>Status</th>
                        <th>Lessons</th>
                        <th>Students</th>
                        <th className="pe-4 text-end">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {courses.map((c) => (
                        <tr key={c.courseId}>

                          {/* Course Information */}
                          <td className="ps-4">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={
                                  c.thumbnail ||
                                  'https://via.placeholder.com/60'
                                }
                                alt={c.title}
                                className="rounded-3"
                                style={{
                                  width: '48px',
                                  height: '36px',
                                  objectFit: 'cover'
                                }}
                              />

                              <div
                                className="fw-semibold text-dark text-truncate"
                                style={{ maxWidth: '200px' }}
                                title={c.title}
                              >
                                {c.title}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td>
                            <span className="badge bg-light text-secondary border">
                              {c.category}
                            </span>
                          </td>

                          {/* Instructor */}
                          <td className="text-secondary small">
                            {c.instructorName}
                          </td>

                          {/* Price in INR */}
                          <td className="fw-bold text-primary">
                            {Number(c.price) > 0
                              ? formatINR(c.price)
                              : 'FREE'}
                          </td>

                          {/* Course Status */}
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                c.status === 'PUBLISHED'
                                  ? 'bg-success-subtle text-success border border-success-subtle'
                                  : 'bg-secondary-subtle text-secondary'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>

                          {/* Lessons */}
                          <td>{c.totalLessons}</td>

                          {/* Students */}
                          <td>{c.totalEnrolledStudents}</td>

                          {/* Actions */}
                          <td className="pe-4 text-end">

                            <Link
                              to={`/courses/${c.courseId}`}
                              className="btn btn-sm btn-outline-secondary rounded-pill px-2 me-1"
                              title="View Course Page"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>

                            <Link
                              to={`/instructor/courses/${c.courseId}/edit`}
                              className="btn btn-sm btn-outline-primary rounded-pill px-2 me-1"
                              title="Edit Course"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>

                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-2"
                              title="Delete Course"
                              onClick={() => setSelectedCourse(c)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>

                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

              ) : (

                <EmptyState
                  icon="bi-collection-play"
                  title="No Courses Found"
                  message="There are currently no courses in the database."
                />

              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">

                <span className="small text-secondary">
                  Page {pagination.pageNumber + 1} of {pagination.totalPages}
                </span>

                <div className="d-flex gap-1">

                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    disabled={pagination.pageNumber === 0}
                    onClick={() =>
                      fetchCourses(pagination.pageNumber - 1)
                    }
                  >
                    Previous
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    disabled={
                      pagination.pageNumber >= pagination.totalPages - 1
                    }
                    onClick={() =>
                      fetchCourses(pagination.pageNumber + 1)
                    }
                  >
                    Next
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            show={!!selectedCourse}
            title="Delete Course"
            message={`Are you sure you want to delete '${selectedCourse?.title}'? All associated lessons, enrollments, and progress records will be permanently removed.`}
            confirmText="Delete Course"
            confirmVariant="danger"
            loading={modalLoading}
            onConfirm={handleDeleteCourse}
            onCancel={() => setSelectedCourse(null)}
          />

        </main>
      </div>
    </div>
  );
};

export default ManageCoursesPage;
