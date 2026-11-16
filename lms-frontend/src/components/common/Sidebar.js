import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="sidebar-container h-100">
      {/* Admin Navigation */}
      {role === 'ADMIN' && (
        <div>
          <div className="sidebar-heading">Platform Administration</div>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i> Dashboard Overview
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-mortarboard"></i> Manage Students
          </NavLink>
          <NavLink to="/admin/instructors" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-person-badge"></i> Manage Instructors
          </NavLink>
          <NavLink to="/admin/courses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-collection-play"></i> Manage All Courses
          </NavLink>
          <NavLink to="/admin/enrollments" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-card-checklist"></i> All Enrollments
          </NavLink>
        </div>
      )}

      {/* Instructor Navigation */}
      {role === 'INSTRUCTOR' && (
        <div>
          <div className="sidebar-heading">Instructor Workspace</div>
          <NavLink to="/instructor/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i> Dashboard Overview
          </NavLink>
          <NavLink to="/instructor/courses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-journal-bookmark"></i> My Authored Courses
          </NavLink>
          <NavLink to="/instructor/courses/create" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-plus-circle"></i> Create New Course
          </NavLink>
          <NavLink to="/instructor/enrollments" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-people"></i> Enrolled Students
          </NavLink>
        </div>
      )}

      {/* Student Navigation */}
      {role === 'STUDENT' && (
        <div>
          <div className="sidebar-heading">Student Portal</div>
          <NavLink to="/student/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i> Learning Dashboard
          </NavLink>
          <NavLink to="/student/enrolled" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-journal-check"></i> My Enrolled Courses
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
            <i className="bi bi-compass"></i> Discover Courses
          </NavLink>
        </div>
      )}

      {/* General Links */}
      <div className="mt-4 pt-3 border-top">
        <div className="sidebar-heading">Account & System</div>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-person-gear"></i> Account Profile
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
