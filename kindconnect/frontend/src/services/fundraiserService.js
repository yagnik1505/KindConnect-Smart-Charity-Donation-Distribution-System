import api from './api';

// ============ NGO ENDPOINTS ============

// Create a new fundraiser
export const createFundraiser = async (data) => {
  return api.post('/ngo/fundraisers/create', data);
};

// Get NGO's fundraisers
export const getMyFundraisers = async () => {
  const response = await api.get('/ngo/fundraisers/my-fundraisers');
  return response.data;
};

// Update fundraiser
export const updateFundraiser = async (id, data) => {
  return api.put(`/ngo/fundraisers/${id}`, data);
};

// Toggle fundraiser status (pause/resume)
export const toggleFundraiserStatus = async (id) => {
  return api.patch(`/ngo/fundraisers/${id}/toggle-status`);
};

// ============ PUBLIC ENDPOINTS ============

// Get all active fundraisers
export const getActiveFundraisers = async () => {
  const response = await api.get('/ngo/fundraisers/active');
  return response.data;
};

// Get fundraiser by ID
export const getFundraiserById = async (id) => {
  const response = await api.get(`/ngo/fundraisers/${id}`);
  return response.data;
};

// Get fundraisers by category
export const getFundraisersByCategory = async (category) => {
  const response = await api.get(`/ngo/fundraisers/category/${category}`);
  return response.data;
};

// Get featured fundraisers
export const getFeaturedFundraisers = async () => {
  const response = await api.get('/ngo/fundraisers/featured');
  return response.data;
};

// Get urgent fundraisers
export const getUrgentFundraisers = async () => {
  const response = await api.get('/ngo/fundraisers/urgent');
  return response.data;
};

// Search fundraisers
export const searchFundraisers = async (query) => {
  const response = await api.get(`/ngo/fundraisers/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get('/ngo/fundraisers/categories');
  return response.data;
};

// ============ DONATION ENDPOINTS ============

// Donate to a fundraiser
export const donateToFundraiser = async (fundraiserId, data) => {
  return api.post(`/ngo/fundraisers/${fundraiserId}/donate`, data);
};

// Get donations for a fundraiser
export const getFundraiserDonations = async (fundraiserId) => {
  const response = await api.get(`/ngo/fundraisers/${fundraiserId}/donations`);
  return response.data;
};

// Get recent donations for a fundraiser
export const getRecentDonations = async (fundraiserId) => {
  const response = await api.get(`/ngo/fundraisers/${fundraiserId}/recent-donations`);
  return response.data;
};

// Get donor's donation history
export const getMyFundraiserDonations = async () => {
  const response = await api.get('/ngo/fundraisers/my-donations');
  return response.data;
};

// ============ IMPACT STATISTICS ============

// Get donor's impact statistics
export const getImpactStats = async () => {
  const response = await api.get('/ngo/fundraisers/impact-stats');
  return response.data;
};
