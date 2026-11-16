import api from './api';

const courseService = {
  getCourses: async (params = {}) => {
    const response = await api.get('/api/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/courses/categories');
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/api/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
  },

  getMyCourses: async (params = {}) => {
    const response = await api.get('/api/courses/instructor/my-courses', { params });
    return response.data;
  },
};

export default courseService;
