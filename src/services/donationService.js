import api from './api';

export const donationService = {
  async getDonations(params = {}) {
    // params: { donor, blood_group, status, date_from, date_to, search }
    const response = await api.get('/donations/', { params });
    return response.data;
  },

  async getDonationById(id) {
    const response = await api.get(`/donations/${id}/`);
    return response.data;
  },

  async createDonation(data) {
    const response = await api.post('/donations/', data);
    return response.data;
  },

  async updateDonation(id, data) {
    const response = await api.put(`/donations/${id}/`, data);
    return response.data;
  },

  async deleteDonation(id) {
    const response = await api.delete(`/donations/${id}/`);
    return response.data;
  },
};
