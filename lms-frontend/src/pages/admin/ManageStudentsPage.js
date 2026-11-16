import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../services/userService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import EmptyState from '../../components/common/EmptyState';

const ManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ pageNumber: 0, totalPages: 0, totalElements: 0 });
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(''); // 'DELETE' or 'STATUS'
  const [modalLoading, setModalLoading] = useState(false);

  const fetchStudents = useCallback(async (page = 0, searchKeyword = keyword) => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getStudents({ page, size: 10, keyword: searchKeyword });
      setStudents(data.content || []);
      setPagination({
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchStudents(0);
  }, [fetchStudents]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents(0, keyword);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    setModalLoading(true);
    try {
      if (modalType === 'STATUS') {
        const newStatus = selectedUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        await userService.updateUserStatus(selectedUser.id, newStatus);
        setSuccess(`Student status updated to ${newStatus}`);
      } else if (modalType === 'DELETE') {
        await userService.deleteUser(selectedUser.id);
        setSuccess('Student account removed successfully');
      }
      setSelectedUser(null);
      setModalType('');
      fetchStudents(pagination.pageNumber);
    } catch (err) {
      setError(err.message || 'Action failed');
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
              <h2 className="fw-bold text-dark mb-1">Manage Students</h2>
              <p className="text-secondary small mb-0">Total Enrolled Learners: {pagination.totalElements}</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2 bg-white"
                placeholder="Search by name or email..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ width: '260px' }}
              />
              <button type="submit" className="btn btn-primary rounded-pill px-3">
                <i className="bi bi-search"></i>
              </button>
            </form>
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

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-body p-0">
              {loading ? (
                <LoadingSpinner message="Fetching students directory..." />
              ) : students.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Student Name</th>
                        <th>Email Address</th>
                        <th>Phone Number</th>
                        <th>Account Status</th>
                        <th>Registered Date</th>
                        <th className="pe-4 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="ps-4 fw-semibold text-dark">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
                                style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                              >
                                {student.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span>{student.fullName}</span>
                            </div>
                          </td>
                          <td className="text-secondary">{student.email}</td>
                          <td className="text-secondary">{student.phoneNumber || 'N/A'}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                student.status === 'ACTIVE'
                                  ? 'bg-success-subtle text-success border border-success-subtle'
                                  : 'bg-danger-subtle text-danger border border-danger-subtle'
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="text-secondary small">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                          <td className="pe-4 text-end">
                            <button
                              className={`btn btn-sm rounded-pill px-3 me-2 ${
                                student.status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'
                              }`}
                              onClick={() => {
                                setSelectedUser(student);
                                setModalType('STATUS');
                              }}
                            >
                              {student.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-2"
                              onClick={() => {
                                setSelectedUser(student);
                                setModalType('DELETE');
                              }}
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
                  icon="bi-people"
                  title="No Students Found"
                  message="No student accounts matched your query criteria."
                />
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                <span className="small text-secondary">
                  Page {pagination.pageNumber + 1} of {pagination.totalPages}
                </span>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    disabled={pagination.pageNumber === 0}
                    onClick={() => fetchStudents(pagination.pageNumber - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    disabled={pagination.pageNumber >= pagination.totalPages - 1}
                    onClick={() => fetchStudents(pagination.pageNumber + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Modal */}
          <ConfirmationModal
            show={!!selectedUser}
            title={modalType === 'STATUS' ? 'Toggle User Status' : 'Delete Student Account'}
            message={
              modalType === 'STATUS'
                ? `Are you sure you want to change ${selectedUser?.fullName}'s status to ${
                    selectedUser?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                  }?`
                : `Are you sure you want to delete ${selectedUser?.fullName}'s account? This action cannot be reversed.`
            }
            confirmText={modalType === 'STATUS' ? 'Update Status' : 'Delete Account'}
            confirmVariant={modalType === 'STATUS' ? 'warning' : 'danger'}
            loading={modalLoading}
            onConfirm={handleConfirmAction}
            onCancel={() => {
              setSelectedUser(null);
              setModalType('');
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default ManageStudentsPage;
