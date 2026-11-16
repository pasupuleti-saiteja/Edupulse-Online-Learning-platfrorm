import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle globally
api.interceptors.response.use(
  (response) => response.data, // Unwraps to the ApiResponse body
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle token expiration or unauthorized access
      if (status === 401) {
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      const errorMessage = data?.message || data?.data?.message || 'A network error occurred. Please try again.';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Unable to connect to the LMS backend server. Please verify the backend is running.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
