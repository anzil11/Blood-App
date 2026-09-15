import api from './api';

export const authService = {
  async register(formData) {
    // If formData is FormData (for photo upload) or JSON object
    const isFormData = formData instanceof FormData;
    const response = await api.post('/auth/register/', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  async login(username, password) {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },

  async logout(refreshToken) {
    try {
      await api.post('/auth/logout/', { refresh: refreshToken });
    } catch (e) {
      console.warn('Logout notification error', e);
    }
  },

  async getMe() {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  async updateMe(userData) {
    const isFormData = userData instanceof FormData;
    const response = await api.put('/auth/me/', userData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
};
