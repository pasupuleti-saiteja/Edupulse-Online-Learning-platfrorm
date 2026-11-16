import api from './api';

const lessonService = {
  getLessonsByCourse: async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}/lessons`);
    return response.data;
  },

  getLessonById: async (lessonId) => {
    const response = await api.get(`/api/lessons/${lessonId}`);
    return response.data;
  },

  addLesson: async (courseId, lessonData) => {
    const response = await api.post(`/api/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },

  updateLesson: async (lessonId, lessonData) => {
    const response = await api.put(`/api/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  deleteLesson: async (lessonId) => {
    const response = await api.delete(`/api/lessons/${lessonId}`);
    return response.data;
  },
};

export default lessonService;
