import api from './api';

const userService = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/api/users/change-password', passwordData);
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  getStudents: async (params = {}) => {
    const response = await api.get('/api/admin/students', { params });
    return response.data;
  },

  getInstructors: async (params = {}) => {
    const response = await api.get('/api/admin/instructors', { params });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/api/admin/users/${userId}/status`, { status });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  },
};

export default userService;
