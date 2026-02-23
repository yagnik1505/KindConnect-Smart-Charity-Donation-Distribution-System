import axios from 'axios';

const API_BASE_URL = 'http://localhost:8765';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Get user role from localStorage
const getUserRole = () => localStorage.getItem('userRole');

// Axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============= DONOR PROFILE =============
export const createDonorProfile = async (profileData) => {
  const response = await apiClient.post('/profiles/donor', profileData);
  return response.data;
};

export const getDonorProfile = async () => {
  const response = await apiClient.get('/profiles/donor/me');
  return response.data;
};

export const updateDonorProfile = async (profileData) => {
  const response = await apiClient.put('/profiles/donor/me', profileData);
  return response.data;
};

// ============= NGO PROFILE =============
export const createNgoProfile = async (profileData) => {
  const response = await apiClient.post('/profiles/ngo', profileData);
  return response.data;
};

export const getNgoProfile = async () => {
  const response = await apiClient.get('/profiles/ngo/me');
  return response.data;
};

export const updateNgoProfile = async (profileData) => {
  const response = await apiClient.put('/profiles/ngo/me', profileData);
  return response.data;
};

// Get all approved NGOs (for donors to browse)
export const getAllApprovedNgos = async () => {
  const response = await apiClient.get('/profiles/ngo/all');
  return response.data;
};

// Get all NGOs (including pending - for stats)
export const getAllNgos = async () => {
  const response = await apiClient.get('/profiles/ngo/list');
  return response.data;
};

// Get NGOs for public display (no auth required)
export const getPublicNgos = async () => {
  const response = await axios.get(`${API_BASE_URL}/profiles/ngo/list`);
  return response.data;
};

// Get NGOs by city
export const getNgosByCity = async (city) => {
  const response = await apiClient.get('/profiles/ngo/city', {
    params: { city }
  });
  return response.data;
};

// ============= DRIVER PROFILE =============
export const createDriverProfile = async (profileData) => {
  const response = await apiClient.post('/profiles/driver', profileData);
  return response.data;
};

export const getDriverProfile = async () => {
  const response = await apiClient.get('/profiles/driver/me');
  return response.data;
};

export const updateDriverProfile = async (profileData) => {
  const response = await apiClient.put('/profiles/driver/me', profileData);
  return response.data;
};

export const updateDriverAvailability = async (available) => {
  const response = await apiClient.put('/profiles/driver/availability', null, {
    params: { available }
  });
  return response.data;
};

// ============= PROFILE COMPLETION CHECK =============
export const checkProfileCompletion = async () => {
  const role = getUserRole();
  
  try {
    let response;
    if (role === 'DONOR') {
      response = await getDonorProfile();
    } else if (role === 'NGO') {
      response = await getNgoProfile();
    } else if (role === 'DRIVER') {
      response = await getDriverProfile();
    }
    
    return {
      hasProfile: !!response?.data,
      profile: response?.data,
      role
    };
  } catch (error) {
    // Return false for any error (404, 500, timeout, etc)
    return { hasProfile: false, profile: null, role };
  }
};

export default {
  createDonorProfile,
  getDonorProfile,
  createNgoProfile,
  getNgoProfile,
  createDriverProfile,
  getDriverProfile,
  updateDriverAvailability,
  checkProfileCompletion
};
