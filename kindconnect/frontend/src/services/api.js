import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8765',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('profileCompleted');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
