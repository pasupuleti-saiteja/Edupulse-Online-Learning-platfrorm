import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../services/userService';
import Sidebar from '../../components/common/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import EmptyState from '../../components/common/EmptyState';

const ManageInstructorsPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [pagination, setPagination] = useState({ pageNumber: 0, totalPages: 0, totalElements: 0 });
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const fetchInstructors = useCallback(async (page = 0, searchKeyword = keyword) => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getInstructors({ page, size: 10, keyword: searchKeyword });
      setInstructors(data.content || []);
      setPagination({
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchInstructors(0);
  }, [fetchInstructors]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInstructors(0, keyword);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    setModalLoading(true);
    try {
      if (modalType === 'STATUS') {
        const newStatus = selectedUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        await userService.updateUserStatus(selectedUser.id, newStatus);
        setSuccess(`Instructor status updated to ${newStatus}`);
      } else if (modalType === 'DELETE') {
        await userService.deleteUser(selectedUser.id);
        setSuccess('Instructor account removed successfully');
      }
      setSelectedUser(null);
      setModalType('');
      fetchInstructors(pagination.pageNumber);
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
              <h2 className="fw-bold text-dark mb-1">Manage Instructors</h2>
              <p className="text-secondary small mb-0">Total Certified Instructors: {pagination.totalElements}</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
              <input
                type="text"
                className="form-control rounded-pill px-3 py-2 bg-white"
                placeholder="Search instructors..."
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
                <LoadingSpinner message="Fetching instructors roster..." />
              ) : instructors.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Instructor</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th className="pe-4 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructors.map((inst) => (
                        <tr key={inst.id}>
                          <td className="ps-4 fw-semibold text-dark">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center fw-bold"
                                style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                              >
                                {inst.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span>{inst.fullName}</span>
                            </div>
                          </td>
                          <td className="text-secondary">{inst.email}</td>
                          <td className="text-secondary">{inst.phoneNumber || 'N/A'}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                inst.status === 'ACTIVE'
                                  ? 'bg-success-subtle text-success border border-success-subtle'
                                  : 'bg-danger-subtle text-danger border border-danger-subtle'
                              }`}
                            >
                              {inst.status}
                            </span>
                          </td>
                          <td className="text-secondary small">
                            {new Date(inst.createdAt).toLocaleDateString()}
                          </td>
                          <td className="pe-4 text-end">
                            <button
                              className={`btn btn-sm rounded-pill px-3 me-2 ${
                                inst.status === 'ACTIVE' ? 'btn-outline-warning' : 'btn-outline-success'
                              }`}
                              onClick={() => {
                                setSelectedUser(inst);
                                setModalType('STATUS');
                              }}
                            >
                              {inst.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-2"
                              onClick={() => {
                                setSelectedUser(inst);
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
                  icon="bi-person-badge"
                  title="No Instructors Found"
                  message="No instructor accounts matched your query."
                />
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="card-footer bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                <span className="small text-secondary">
                  Page {pagination.pageNumber + 1} of {pagination.totalPages}
                </span>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    disabled={pagination.pageNumber === 0}
                    onClick={() => fetchInstructors(pagination.pageNumber - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                    disabled={pagination.pageNumber >= pagination.totalPages - 1}
                    onClick={() => fetchInstructors(pagination.pageNumber + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          <ConfirmationModal
            show={!!selectedUser}
            title={modalType === 'STATUS' ? 'Toggle Instructor Status' : 'Delete Instructor Account'}
            message={
              modalType === 'STATUS'
                ? `Update status for ${selectedUser?.fullName} to ${
                    selectedUser?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                  }?`
                : `Delete instructor account for ${selectedUser?.fullName}?`
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

export default ManageInstructorsPage;
