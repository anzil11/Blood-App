import api from './api';

export const donorService = {
  async getDonors(params = {}) {
    // params: { blood_group, city, eligible, availability, is_active, search }
    const response = await api.get('/donors/', { params });
    return response.data;
  },

  async getDonorById(id) {
    const response = await api.get(`/donors/${id}/`);
    return response.data;
  },

  async createDonor(donorData) {
    const isFormData = donorData instanceof FormData;
    const response = await api.post('/donors/', donorData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  async updateDonor(id, donorData) {
    const isFormData = donorData instanceof FormData;
    const response = await api.put(`/donors/${id}/`, donorData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  async deleteDonor(id) {
    const response = await api.delete(`/donors/${id}/`);
    return response.data;
  },
};
