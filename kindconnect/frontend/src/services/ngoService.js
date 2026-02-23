import api from './api';

// ============= NGO DASHBOARD =============
export const getNgoDashboard = async () => {
  const response = await api.get('/ngo/dashboard');
  return response.data;
};

// ============= MY ACCEPTED DONATIONS =============
export const getMyAcceptedDonations = async () => {
  const response = await api.get('/ngo/donations/my');
  return response.data;
};

// ============= AVAILABLE DONATIONS (from Donation Service) =============
export const getAvailableDonations = async () => {
  const response = await api.get('/donations/available');
  return response.data;
};

// ============= ACCEPT DONATION =============
export const acceptDonation = async (donationId) => {
  const response = await api.put(`/ngo/donations/${donationId}/accept`);
  return response.data;
};

// ============= CANCEL DONATION =============
export const cancelDonation = async (donationId) => {
  const response = await api.put(`/ngo/donations/${donationId}/cancel`);
  return response.data;
};

// ============= GET DONATION DETAILS =============
export const getDonationDetails = async (donationId) => {
  const response = await api.get(`/donations/${donationId}`);
  return response.data;
};
