import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import lessonService from '../../services/lessonService';
import progressService from '../../services/progressService';
import courseService from '../../services/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LessonPlayerPage = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedLessonId = searchParams.get('lesson');

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [error, setError] = useState('');

  const loadLearningData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [courseData, lessonsData, progressResponse] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.getLessonsByCourse(courseId),
        progressService.getCourseProgress(courseId),
      ]);

      setCourse(courseData);
      setLessons(lessonsData || []);
      setProgressData(progressResponse);

      // Determine active lesson
      if (lessonsData && lessonsData.length > 0) {
        let selected = null;
        if (requestedLessonId) {
          selected = lessonsData.find((l) => l.lessonId === Number(requestedLessonId));
        }
        if (!selected) {
          // Select first uncompleted lesson, or simply the first lesson
          selected = lessonsData.find((l) => !l.isCompleted) || lessonsData[0];
        }
        setActiveLesson(selected);
      }
    } catch (err) {
      setError(err.message || 'Failed to load lesson learning environment');
    } finally {
      setLoading(false);
    }
  }, [courseId, requestedLessonId]);

  useEffect(() => {
    loadLearningData();
  }, [loadLearningData]);

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    setSearchParams({ lesson: lesson.lessonId });
  };

  const handleMarkCompleted = async () => {
    if (!activeLesson) return;
    setCompleteLoading(true);
    try {
      const updatedProgress = await progressService.markLessonCompleted(activeLesson.lessonId);
      setProgressData(updatedProgress);

      // Update local lesson completion state
      setLessons((prev) =>
        prev.map((l) =>
          l.lessonId === activeLesson.lessonId ? { ...l, isCompleted: true } : l
        )
      );

      // Move to next lesson if available
      const currentIndex = lessons.findIndex((l) => l.lessonId === activeLesson.lessonId);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        setActiveLesson(nextLesson);
        setSearchParams({ lesson: nextLesson.lessonId });
      }
    } catch (err) {
      console.error('Failed to mark lesson completed:', err);
    } finally {
      setCompleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Setting up your interactive learning workspace..." />;

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger py-3 px-4 d-inline-block rounded-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
        <div className="mt-3">
          <Link to="/student/dashboard" className="btn btn-primary rounded-pill px-4">
            Back to Learning Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Top Learning Navigation Bar */}
      <div className="bg-white border-bottom py-3 sticky-top shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <Link to="/student/dashboard" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                <i className="bi bi-arrow-left me-1"></i> Dashboard
              </Link>
              <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: '450px' }} title={course?.title}>
                {course?.title}
              </h5>
            </div>

            {/* Overall Course Progress */}
            {progressData && (
              <div className="d-flex align-items-center gap-3">
                <div className="text-end d-none d-sm-block">
                  <div className="small fw-semibold text-secondary">Course Progress</div>
                  <div className="fw-bold text-primary">{progressData.progressPercentage}% Completed</div>
                </div>
                <div className="progress" style={{ width: '120px', height: '8px' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    style={{ width: `${progressData.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Learning Split Layout */}
      <div className="container-fluid px-4 py-4">
        <div className="row g-4">
          {/* Left Column: Video & Lesson Content */}
          <div className="col-12 col-lg-8">
            {activeLesson ? (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-4">
                {/* Responsive Video Embed */}
                {activeLesson.videoUrl ? (
                  <div className="video-responsive-wrapper mb-4 shadow-sm">
                    <iframe
                      src={activeLesson.videoUrl}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-4 bg-light rounded-4 text-center border mb-4">
                    <i className="bi bi-book fs-1 text-primary mb-2 d-block"></i>
                    <h6 className="fw-bold text-dark">Reading & Guided Exercise Module</h6>
                    <p className="text-secondary small mb-0">Follow the reading materials and code instructions below.</p>
                  </div>
                )}

                {/* Lesson Header & Mark Completed Action */}
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4 pb-3 border-bottom">
                  <div>
                    <span className="badge bg-primary-subtle text-primary rounded-pill mb-2">
                      Lesson {activeLesson.sequenceNumber} &bull; {activeLesson.duration || 'Self-paced'}
                    </span>
                    <h3 className="fw-bold text-dark mb-1">{activeLesson.title}</h3>
                    <p className="text-secondary small mb-0">{activeLesson.description}</p>
                  </div>

                  <div>
                    {activeLesson.isCompleted ? (
                      <button className="btn btn-success rounded-pill px-4 py-2 fw-semibold" disabled>
                        <i className="bi bi-check-circle-fill me-2"></i> Completed
                      </button>
                    ) : (
                      <button
                        onClick={handleMarkCompleted}
                        disabled={completeLoading}
                        className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
                      >
                        {completeLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check2-circle me-1"></i> Mark as Completed
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Reading Notes / Content Section */}
                <div className="lesson-content-area">
                  <h5 className="fw-bold text-dark mb-3">Lesson Notes & Material</h5>
                  <div
                    className="p-3 bg-light rounded-3 text-secondary lh-base"
                    style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}
                  >
                    {activeLesson.content || 'No additional notes provided for this lesson.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <p className="text-muted">No lessons found in this course.</p>
              </div>
            )}
          </div>

          {/* Right Column: Curriculum Playlist Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white sticky-top" style={{ top: '85px' }}>
              <div className="card-header bg-white border-bottom p-3">
                <h6 className="fw-bold text-dark mb-0 d-flex align-items-center justify-content-between">
                  <span>Curriculum Syllabus</span>
                  <span className="badge bg-light text-secondary border">
                    {lessons.filter((l) => l.isCompleted).length} / {lessons.length} Completed
                  </span>
                </h6>
              </div>

              <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '70vh' }}>
                {lessons.map((lesson) => {
                  const isActive = activeLesson?.lessonId === lesson.lessonId;
                  return (
                    <button
                      key={lesson.lessonId}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`list-group-item list-group-item-action p-3 d-flex align-items-center gap-3 border-bottom text-start ${
                        isActive ? 'bg-primary-subtle text-primary fw-semibold' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {lesson.isCompleted ? (
                          <i className="bi bi-check-circle-fill text-success fs-5"></i>
                        ) : (
                          <div
                            className="rounded-circle border border-2 border-secondary d-flex align-items-center justify-content-center text-muted small fw-bold"
                            style={{ width: '22px', height: '22px', fontSize: '0.75rem' }}
                          >
                            {lesson.sequenceNumber}
                          </div>
                        )}
                      </div>

                      <div className="flex-grow-1 overflow-hidden">
                        <div className="text-truncate small">{lesson.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {lesson.duration || 'Self-paced'}
                        </div>
                      </div>

                      {isActive && <i className="bi bi-play-fill text-primary fs-5"></i>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayerPage;
