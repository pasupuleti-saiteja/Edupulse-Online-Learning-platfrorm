import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUserProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    role: '',
    status: '',
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfileForm({
          fullName: data.fullName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          role: data.role || '',
          status: data.status || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      const updated = await userService.updateProfile({
        fullName: profileForm.fullName,
        phoneNumber: profileForm.phoneNumber,
      });
      updateUserProfileState({ fullName: updated.fullName });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setSaveLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-3 col-lg-2 p-0">
          <Sidebar />
        </div>

        <main className="col-12 col-md-9 col-lg-10 p-4 p-md-5 bg-light min-vh-100">
          <div className="mb-4">
            <h2 className="fw-bold text-dark mb-1">Account Settings</h2>
            <p className="text-secondary small">Manage your personal profile details and security credentials</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show rounded-3 py-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 py-2" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>{success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading account information..." />
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              {/* Tab Header */}
              <div className="card-header bg-white border-bottom px-4 pt-4 pb-0">
                <ul className="nav nav-tabs border-0">
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 fw-semibold px-4 py-3 ${
                        activeTab === 'profile' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'
                      }`}
                      onClick={() => {
                        setActiveTab('profile');
                        setError('');
                        setSuccess('');
                      }}
                    >
                      <i className="bi bi-person me-2"></i> Personal Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link border-0 fw-semibold px-4 py-3 ${
                        activeTab === 'password' ? 'active text-primary border-bottom border-primary border-3' : 'text-secondary'
                      }`}
                      onClick={() => {
                        setActiveTab('password');
                        setError('');
                        setSuccess('');
                      }}
                    >
                      <i className="bi bi-shield-lock me-2"></i> Security & Password
                    </button>
                  </li>
                </ul>
              </div>

              {/* Tab Content */}
              <div className="card-body p-4 p-md-5">
                {activeTab === 'profile' ? (
                  <form onSubmit={handleProfileSubmit}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Full Name *</label>
                        <input
                          type="text"
                          className="form-control bg-light py-2"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Email Address (Read-only)</label>
                        <input
                          type="email"
                          className="form-control bg-light py-2"
                          value={profileForm.email}
                          disabled
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                        <input
                          type="text"
                          className="form-control bg-light py-2"
                          placeholder="+1-555-0123"
                          value={profileForm.phoneNumber}
                          onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-secondary">Platform Role</label>
                        <input
                          type="text"
                          className="form-control bg-light py-2 text-uppercase fw-semibold"
                          value={profileForm.role}
                          disabled
                        />
                      </div>

                      <div className="col-12 mt-4 d-flex justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
                          disabled={saveLoading}
                        >
                          {saveLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="row g-4" style={{ maxWidth: '520px' }}>
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">Current Password *</label>
                        <input
                          type="password"
                          className="form-control bg-light py-2"
                          placeholder="Enter your current password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">New Password (Min. 6 chars) *</label>
                        <input
                          type="password"
                          className="form-control bg-light py-2"
                          placeholder="Enter a new password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-secondary">Confirm New Password *</label>
                        <input
                          type="password"
                          className="form-control bg-light py-2"
                          placeholder="Re-enter new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
                          disabled={saveLoading}
                        >
                          {saveLoading ? 'Updating Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
