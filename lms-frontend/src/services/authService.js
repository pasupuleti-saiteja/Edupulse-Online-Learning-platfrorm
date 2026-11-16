import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.success && response.data) {
      localStorage.setItem('lms_token', response.data.token);
      localStorage.setItem('lms_user', JSON.stringify({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.success && response.data) {
      localStorage.setItem('lms_token', response.data.token);
      localStorage.setItem('lms_user', JSON.stringify({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email,
        role: response.data.role,
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('lms_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('lms_token');
  },
};

export default authService;
