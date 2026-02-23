import api from './api';

// ============= DRIVER PROFILE =============
export const createDriverProfile = async (profileData) => {
  const response = await api.post('/profiles/driver', profileData);
  return response.data;
};

export const getDriverProfile = async () => {
  const response = await api.get('/profiles/driver/me');
  return response.data;
};

export const updateDriverAvailability = async (available) => {
  const response = await api.put('/profiles/driver/availability', null, {
    params: { available }
  });
  return response.data;
};

// ============= DRIVER DASHBOARD =============
export const getDriverDashboard = async () => {
  const response = await api.get('/driver/dashboard');
  return response.data;
};

// ============= AVAILABLE PICKUPS =============
export const getAvailablePickups = async () => {
  const response = await api.get('/driver/donations/available');
  return response.data;
};

// ============= PICKUP DONATION =============
export const pickupDonation = async (donationId) => {
  const response = await api.put(`/driver/donations/${donationId}/pickup`);
  return response.data;
};

// ============= DELIVER DONATION =============
export const deliverDonation = async (donationId) => {
  const response = await api.put(`/driver/donations/${donationId}/deliver`);
  return response.data;
};

// ============= GET DONATION DETAILS =============
export const getDonationDetails = async (donationId) => {
  const response = await api.get(`/donations/${donationId}`);
  return response.data;
};

// ============= GET DRIVER DELIVERIES =============
export const getInTransitDeliveries = async () => {
  const response = await api.get('/donations/driver/in-transit');
  return response.data;
};

export const getCompletedDeliveries = async () => {
  const response = await api.get('/donations/driver/completed');
  return response.data;
};

export default {
  createDriverProfile,
  getDriverProfile,
  updateDriverAvailability,
  getDriverDashboard,
  getAvailablePickups,
  pickupDonation,
  deliverDonation,
  getDonationDetails,
  getInTransitDeliveries,
  getCompletedDeliveries
};
