import api from './api';

// Create a new donation
export const createDonation = async (donationData) => {
  const response = await api.post('/donations', donationData);
  return response.data;
};

// Get my donations
export const getMyDonations = async () => {
  const response = await api.get('/donations/my');
  return response.data;
};

// Get donation by ID
export const getDonationById = async (donationId) => {
  const response = await api.get(`/donations/${donationId}`);
  return response.data;
};

// Cancel donation
export const cancelDonation = async (donationId) => {
  const response = await api.put(`/donations/${donationId}/cancel`);
  return response.data;
};

// Get available donations for NGO
export const getAvailableDonations = async () => {
  const response = await api.get('/donations/available');
  return response.data;
};
