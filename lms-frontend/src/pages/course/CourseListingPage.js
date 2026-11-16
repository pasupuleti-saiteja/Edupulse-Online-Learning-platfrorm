
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import courseService from '../../services/courseService';
import CourseCard from '../../components/course/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const CourseListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');

  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');

  const fetchCourses = useCallback(async (page = 0) => {
    try {
      setLoading(true);

      const params = {
        page,
        size: 9,
        query: query.trim() || undefined,
        category: category || undefined,
        level: level || undefined,
        sortBy,
        direction,
      };

      const data = await courseService.getCourses(params);

      setCourses(data.content || []);

      setPagination({
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, [query, category, level, sortBy, direction]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const catData = await courseService.getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategoryList();
  }, []);

  useEffect(() => {
    fetchCourses(0);
  }, [fetchCourses]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    setSearchParams({
      query,
      category,
      level,
    });

    fetchCourses(0);
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategory('');
    setLevel('');
    setSortBy('createdAt');
    setDirection('desc');
    setSearchParams({});
  };

  return (
    <div className="container py-5">

      {/* Page Title */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark mb-2">
          Explore Online Courses
        </h1>

        <p className="text-secondary">
          Discover industry-aligned courses created by expert software engineers
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-4 bg-white">
        <form onSubmit={handleSearchSubmit}>
          <div className="row g-3">

            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-secondary">
                Search Courses
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="e.g. Java, Python, React..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary">
                Category
              </label>

              <select
                className="form-select bg-light"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>

                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small fw-semibold text-secondary">
                Skill Level
              </label>

              <select
                className="form-select bg-light"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small fw-semibold text-secondary">
                Sort By
              </label>

              <select
                className="form-select bg-light"
                value={`${sortBy}-${direction}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-');
                  setSortBy(field);
                  setDirection(dir);
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-1 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-outline-secondary w-100 rounded-3 py-2"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* Courses Results */}
      <div className="d-flex justify-content-between align-items-center mb-4 text-secondary small">
        <span>
          Showing <strong>{courses.length}</strong> of{' '}
          <strong>{pagination.totalElements}</strong> courses
        </span>
      </div>

      {loading ? (
        <LoadingSpinner message="Searching courses..." />
      ) : courses.length > 0 ? (
        <>
          <div className="row g-4 mb-5">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="col-12 col-md-6 col-lg-4"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4">

              <button
                className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                disabled={pagination.pageNumber === 0}
                onClick={() => fetchCourses(pagination.pageNumber - 1)}
              >
                <i className="bi bi-chevron-left me-1"></i>
                Previous
              </button>

              <span className="text-secondary small mx-2">
                Page {pagination.pageNumber + 1} of {pagination.totalPages}
              </span>

              <button
                className="btn btn-outline-secondary rounded-pill px-4 btn-sm"
                disabled={pagination.pageNumber >= pagination.totalPages - 1}
                onClick={() => fetchCourses(pagination.pageNumber + 1)}
              >
                Next
                <i className="bi bi-chevron-right ms-1"></i>
              </button>

            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="bi-search"
          title="No Courses Match Your Criteria"
          message="Try adjusting your keyword query, category selection, or difficulty filters."
          actionText="Reset Filters"
          onActionClick={handleResetFilters}
        />
      )}
    </div>
  );
};

export default CourseListingPage;
