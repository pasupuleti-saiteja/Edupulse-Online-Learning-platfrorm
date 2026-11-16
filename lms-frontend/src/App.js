import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CourseListingPage from './pages/course/CourseListingPage';
import CourseDetailsPage from './pages/course/CourseDetailsPage';
import NotFoundPage from './pages/common/NotFoundPage';

// Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import InstructorDashboard from './pages/dashboard/InstructorDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';

// Admin Governance Pages
import ManageStudentsPage from './pages/admin/ManageStudentsPage';
import ManageInstructorsPage from './pages/admin/ManageInstructorsPage';
import ManageCoursesPage from './pages/admin/ManageCoursesPage';

// Course & Learning Pages
import CreateCoursePage from './pages/course/CreateCoursePage';
import EditCoursePage from './pages/course/EditCoursePage';
import CourseLessonsPage from './pages/course/CourseLessonsPage';
import LessonPlayerPage from './pages/learning/LessonPlayerPage';
import StudentEnrolledCoursesPage from './pages/student/StudentEnrolledCoursesPage';

// User Account Pages
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/courses" element={<CourseListingPage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/enrolled"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                    <StudentEnrolledCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:courseId/learn"
                element={
                  <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'INSTRUCTOR']}>
                    <LessonPlayerPage />
                  </ProtectedRoute>
                }
              />

              {/* Instructor Routes */}
              <Route
                path="/instructor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <ManageCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/create"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CreateCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <EditCoursePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/lessons"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <CourseLessonsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/enrollments"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
                    <ManageStudentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageStudentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/instructors"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageInstructorsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ManageStudentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Authenticated Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
