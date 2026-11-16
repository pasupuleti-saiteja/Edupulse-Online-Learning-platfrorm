import api from './api';

const progressService = {
  markLessonCompleted: async (lessonId) => {
    const response = await api.post(`/api/lessons/${lessonId}/complete`);
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}/progress`);
    return response.data;
  },
};

export default progressService;
