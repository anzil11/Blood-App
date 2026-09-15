import api from './api';

export const dashboardService = {
  async getDonorDashboard() {
    const response = await api.get('/dashboard/donor/');
    return response.data;
  },

  async getAdminDashboard() {
    const response = await api.get('/dashboard/admin/');
    return response.data;
  },

  async getUnifiedDashboard() {
    const response = await api.get('/dashboard/');
    return response.data;
  },
};
