import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import courseService from '../../services/courseService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const CourseLessonsPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lesson Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    content: '',
    sequenceNumber: 1,
    duration: '',
  });

  // Delete Modal State
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchLessonsData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [courseData, lessonsData] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.getLessonsByCourse(courseId),
      ]);
      setCourse(courseData);
      setLessons(lessonsData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch course lessons');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchLessonsData();
  }, [fetchLessonsData]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentLessonId(null);
    setLessonForm({
      title: '',
      description: '',
      videoUrl: '',
      content: '',
      sequenceNumber: lessons.length + 1,
      duration: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (lesson) => {
    setIsEditing(true);
    setCurrentLessonId(lesson.lessonId);
    setLessonForm({
      title: lesson.title || '',
      description: lesson.description || '',
      videoUrl: lesson.videoUrl || '',
      content: lesson.content || '',
      sequenceNumber: lesson.sequenceNumber || 1,
      duration: lesson.duration || '',
    });
    setShowModal(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setError('');

    try {
      if (isEditing) {
        await lessonService.updateLesson(currentLessonId, lessonForm);
        setSuccess('Lesson updated successfully');
      } else {
        await lessonService.addLesson(courseId, lessonForm);
        setSuccess('Lesson added to curriculum successfully');
      }
      setShowModal(false);
      fetchLessonsData();
    } catch (err) {
      setError(err.message || 'Failed to save lesson');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    setModalLoading(true);
    try {
      await lessonService.deleteLesson(lessonToDelete.lessonId);
      setSuccess('Lesson deleted successfully');
      setLessonToDelete(null);
      fetchLessonsData();
    } catch (err) {
      setError(err.message || 'Failed to delete lesson');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb small mb-1">
                  <li className="breadcrumb-item"><Link to="/instructor/courses">My Courses</Link></li>
                  <li className="breadcrumb-item active">{course?.title}</li>
                </ol>
              </nav>
              <h2 className="fw-bold text-dark mb-1">Manage Course Curriculum</h2>
              <p className="text-secondary small mb-0">{lessons.length} Lessons configured in sequence</p>
            </div>

            <div className="d-flex gap-2">
              <button onClick={handleOpenAddModal} className="btn btn-primary rounded-pill px-4 py-2 shadow-sm fw-semibold">
                <i className="bi bi-plus-circle me-2"></i> Add New Lesson
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          )}

          {success && (
            <div className="alert alert-success py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>{success}
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading course curriculum..." />
          ) : lessons.length > 0 ? (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Sequence</th>
                        <th>Lesson Title</th>
                        <th>Duration</th>
                        <th>Video Source</th>
                        <th className="pe-4 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.map((lesson) => (
                        <tr key={lesson.lessonId}>
                          <td className="ps-4">
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">
                              Lesson {lesson.sequenceNumber}
                            </span>
                          </td>
                          <td>
                            <div className="fw-bold text-dark">{lesson.title}</div>
                            <div className="small text-muted text-truncate" style={{ maxWidth: '350px' }}>
                              {lesson.description || 'No description provided'}
                            </div>
                          </td>
                          <td className="text-secondary small">{lesson.duration || 'Self-paced'}</td>
                          <td>
                            {lesson.videoUrl ? (
                              <span className="badge bg-success-subtle text-success">
                                <i className="bi bi-camera-video me-1"></i> Video Attached
                              </span>
                            ) : (
                              <span className="badge bg-light text-muted border">Reading Material</span>
                            )}
                          </td>
                          <td className="pe-4 text-end">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2"
                              onClick={() => handleOpenEditModal(lesson)}
                            >
                              <i className="bi bi-pencil me-1"></i> Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-2"
                              onClick={() => setLessonToDelete(lesson)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-journals fs-1 text-muted mb-3"></i>
              <h5 className="fw-bold text-dark">No Lessons in this Curriculum Yet</h5>
              <p className="text-secondary small mb-3">Begin by adding the first lesson to your course.</p>
              <div>
                <button onClick={handleOpenAddModal} className="btn btn-primary rounded-pill px-4">
                  Add First Lesson
                </button>
              </div>
            </div>
          )}

          {/* Add / Edit Lesson Modal */}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 p-3">
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold text-dark">
                      {isEditing ? 'Edit Lesson' : 'Add New Lesson to Curriculum'}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>

                  <form onSubmit={handleSaveLesson}>
                    <div className="modal-body py-3">
                      <div className="row g-3">
                        <div className="col-md-9">
                          <label className="form-label small fw-semibold text-secondary">Lesson Title *</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="e.g. Introduction to Spring Data JPA"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            required
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label small fw-semibold text-secondary">Sequence Number *</label>
                          <input
                            type="number"
                            min="1"
                            className="form-control bg-light"
                            value={lessonForm.sequenceNumber}
                            onChange={(e) => setLessonForm({ ...lessonForm, sequenceNumber: parseInt(e.target.value) || 1 })}
                            required
                          />
                        </div>

                        <div className="col-md-8">
                          <label className="form-label small fw-semibold text-secondary">Video URL (YouTube/Vimeo Embed)</label>
                          <input
                            type="url"
                            className="form-control bg-light"
                            placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                            value={lessonForm.videoUrl}
                            onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label small fw-semibold text-secondary">Duration</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="e.g. 45 mins"
                            value={lessonForm.duration}
                            onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-semibold text-secondary">Short Description</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="Brief summary of topics covered in this lesson..."
                            value={lessonForm.description}
                            onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-semibold text-secondary">Lesson Reading Notes / Markdown Content</label>
                          <textarea
                            className="form-control bg-light"
                            rows="5"
                            placeholder="Enter detailed lesson content, code snippets, and instructions..."
                            value={lessonForm.content}
                            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer border-0 pt-0">
                      <button
                        type="button"
                        className="btn btn-light rounded-pill px-4"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                        disabled={modalLoading}
                      >
                        {modalLoading ? 'Saving...' : isEditing ? 'Update Lesson' : 'Add Lesson'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          <ConfirmationModal
            show={!!lessonToDelete}
            title="Delete Lesson"
            message={`Are you sure you want to remove lesson '${lessonToDelete?.title}' from this course?`}
            confirmText="Delete Lesson"
            confirmVariant="danger"
            loading={modalLoading}
            onConfirm={handleDeleteLesson}
            onCancel={() => setLessonToDelete(null)}
          />
        </main>
      </div>
    </div>
  );
};

export default CourseLessonsPage;
