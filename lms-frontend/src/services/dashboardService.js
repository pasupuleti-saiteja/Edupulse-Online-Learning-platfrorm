import api from './api';

const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  getInstructorStats: async () => {
    const response = await api.get('/api/instructor/dashboard');
    return response.data;
  },

  getStudentStats: async () => {
    const response = await api.get('/api/student/dashboard');
    return response.data;
  },
};

export default dashboardService;
