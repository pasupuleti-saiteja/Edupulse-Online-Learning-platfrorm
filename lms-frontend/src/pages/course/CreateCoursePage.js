
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import Sidebar from '../../components/common/Sidebar';

const CreateCoursePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    thumbnail: '',
    duration: '',
    price: '',
    level: 'BEGINNER',
    status: 'PUBLISHED',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const created = await courseService.createCourse(formData);

      navigate(
        `/instructor/courses/${created.courseId}/lessons`,
        { replace: true }
      );
    } catch (err) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Instructor Sidebar */}
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">

          <div className="mb-4">
            <h2 className="fw-bold text-dark mb-1">
              Create New Course
            </h2>

            <p className="text-secondary small">
              Set up your curriculum metadata, pricing, and visual thumbnail
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger py-2 px-3 rounded-3 mb-4"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">

            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                {/* Course Title */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control bg-light py-2"
                    placeholder="e.g. Master Spring Boot 3 & React 18 Architecture"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Course Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Description *
                  </label>

                  <textarea
                    name="description"
                    className="form-control bg-light"
                    rows="4"
                    placeholder="Provide a comprehensive summary of learning objectives, prerequisites, and skills gained..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Category */}
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

                {/* Skill Level */}
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

                {/* Publication Status */}
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
                    <option value="DRAFT">Draft (Unlisted)</option>
                    <option value="PUBLISHED">Published (Live in Catalog)</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Estimated Duration
                  </label>

                  <input
                    type="text"
                    name="duration"
                    className="form-control bg-light py-2"
                    placeholder="e.g. 24 hours or 6 weeks"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>

                {/* Course Price - INR */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Price (INR ₹)
                  </label>

                  <div className="input-group">
                    <span className="input-group-text bg-light fw-semibold">
                      ₹
                    </span>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="price"
                      className="form-control bg-light py-2"
                      placeholder="0.00 for free"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-text small">
                    Enter the course fee in Indian Rupees. Enter 0 for a free course.
                  </div>
                </div>

                {/* Thumbnail URL */}
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">
                    Course Thumbnail Image URL
                  </label>

                  <input
                    type="url"
                    name="thumbnail"
                    className="form-control bg-light py-2"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.thumbnail}
                    onChange={handleChange}
                  />

                  <div className="form-text small">
                    Provide a high-resolution Unsplash or hosted image URL.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-12 mt-4 d-flex justify-content-end gap-2">

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving Course...
                      </>
                    ) : (
                      'Save & Proceed to Lessons'
                    )}
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

export default CreateCoursePage;
