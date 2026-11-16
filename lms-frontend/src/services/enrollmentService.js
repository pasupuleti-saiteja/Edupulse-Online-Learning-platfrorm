import api from './api';

const enrollmentService = {
  enroll: async (courseId) => {
    const response = await api.post('/api/enrollments', { courseId });
    return response.data;
  },

  getMyEnrollments: async (params = {}) => {
    const response = await api.get('/api/enrollments/my-courses', { params });
    return response.data;
  },

  getCourseEnrollments: async (courseId, params = {}) => {
    const response = await api.get(`/api/enrollments/course/${courseId}`, { params });
    return response.data;
  },

  getEnrollmentById: async (enrollmentId) => {
    const response = await api.get(`/api/enrollments/${enrollmentId}`);
    return response.data;
  },

  getAllEnrollments: async (params = {}) => {
    const response = await api.get('/api/enrollments', { params });
    return response.data;
  },
};

export default enrollmentService;
