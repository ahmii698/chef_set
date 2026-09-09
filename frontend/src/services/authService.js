// frontend/src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL;

// ===== HELPER: Handle API Response =====
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// ===== REGISTER =====
export const register = async (fullName, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

// ===== LOGIN =====
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    
    // Agar login successful hai toh token save karo
    if (data.token) {
      saveToken(data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ===== FORGOT PASSWORD - Send OTP =====
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// ===== VERIFY OTP =====
export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};

// ===== RESET PASSWORD =====
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// ===== VERIFY TOKEN (Protected routes ke liye) =====
export const verifyToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Verify token error:', error);
    if (error.message === 'No token found' || error.message === 'Invalid token') {
      removeToken();
    }
    throw error;
  }
};

// ===== TOKEN MANAGEMENT =====
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

// ===== CHECK IF USER IS LOGGED IN =====
export const isAuthenticated = () => {
  return !!getToken();
};