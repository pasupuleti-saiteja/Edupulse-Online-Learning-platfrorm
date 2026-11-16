
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    thumbnail: '',
    duration: '',
    price: 0.0,
    level: 'BEGINNER',
    status: 'DRAFT',
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await courseService.getCourseById(id);

        setFormData({
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'Development',
          thumbnail: data.thumbnail || '',
          duration: data.duration || '',
          price: data.price ?? 0,
          level: data.level || 'BEGINNER',
          status: data.status || 'DRAFT',
        });
      } catch (err) {
        setError(err.message || 'Failed to load course details for editing');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      await courseService.updateCourse(id, formData);
      setSuccess('Course updated successfully!');

      setTimeout(() => {
        navigate('/instructor/courses');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update course');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading course editor..." />;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold text-dark mb-1">Edit Course</h2>
              <p className="text-secondary small mb-0">
                Update metadata and publication status
              </p>
            </div>

            <button
              onClick={() => navigate(`/instructor/courses/${id}/lessons`)}
              className="btn btn-outline-primary rounded-pill px-4 btn-sm"
            >
              <i className="bi bi-list-task me-1"></i> Manage Lessons
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success py-2 px-3 rounded-3 mb-4" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control bg-light py-2"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    className="form-control bg-light"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Category *
                  </label>
                  <select
                    name="category"
                    className="form-select bg-light py-2"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Development">Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                    <option value="Database">Database</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Skill Level *
                  </label>
                  <select
                    name="level"
                    className="form-select bg-light py-2"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold small text-secondary">
                    Publication Status
                  </label>
                  <select
                    name="status"
                    className="form-select bg-light py-2"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    className="form-control bg-light py-2"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Price (INR ₹)
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      className="form-control bg-light py-2"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  <small className="text-muted">
                    Enter the course fee in Indian Rupees. Enter 0 for a free course.
                  </small>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnail"
                    className="form-control bg-light py-2"
                    value={formData.thumbnail}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                    disabled={saveLoading}
                  >
                    {saveLoading ? 'Saving Changes...' : 'Update Course'}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCoursePage;
