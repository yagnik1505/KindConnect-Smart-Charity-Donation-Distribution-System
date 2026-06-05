import api from './api';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replaceAll(/-/g, '+').replaceAll(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.codePointAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Register new user - matches backend: POST /auth/register
// Backend returns: { "Message": "User registered successfully" }
export const register = async (email, password, role) => {
  const response = await api.post('/auth/register', {
    email,
    password,
    role, // DONOR, NGO, or DRIVER
  });
  return response.data;
};

// Request OTP - matches backend: POST /auth/register/request-otp
// Backend returns: { "Message": "OTP sent successfully" }
export const requestOtp = async (email) => {
  const response = await api.post('/auth/register/request-otp', { email });
  return response.data;
};

// Verify OTP - matches backend: POST /auth/register/verify-otp
// Backend returns: { "Message": "OTP verified successfully" }
export const verifyOtp = async (email, otpCode) => {
  const response = await api.post('/auth/register/verify-otp', { email, otpCode });
  return response.data;
};

// Complete Registration - matches backend: POST /auth/register/complete
// Backend returns: { "Message": "User registered successfully" }
export const completeRegistration = async (password, role, otpCode) => {
  const response = await api.post('/auth/register/complete', {
    password,
    role, // DONOR, NGO, or DRIVER
    otpCode,
  });
  return response.data;
};

// Login user - matches backend: POST /auth/login
// Backend returns: { "message": "Login successful", "token": "..." }
export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  
  if (response.data.token) {
    const token = response.data.token;
    localStorage.setItem('authToken', token); // Changed from 'token' to 'authToken'
    
    // Decode token to get user info including role
    const decoded = decodeToken(token);
    const userRole = decoded?.role || decoded?.authorities?.[0] || 'DONOR';
    
    localStorage.setItem('userRole', userRole); // Store role separately
    
    const userInfo = {
      email: decoded?.sub || email,
      role: userRole,
      token: token
    };
    
    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  }
  
  return response.data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('authToken'); // Changed from 'token' to 'authToken'
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('profileCompleted');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};
