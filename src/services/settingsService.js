import api from './api';

export const settingsService = {
  async getDonationSettings() {
    const response = await api.get('/settings/donation/');
    return response.data;
  },

  async updateDonationSettings(minimum_interval_months) {
    const response = await api.put('/settings/donation/', {
      minimum_interval_months: Number(minimum_interval_months),
    });
    return response.data;
  },
};
