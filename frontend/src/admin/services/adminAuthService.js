// src/admin/services/adminAuthService.js
import { API_URL } from "../../../config";

// ===== HELPER: Handle API Response =====
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ===== ADMIN REGISTER =====
export const adminRegister = async (fullName, email, password) => {
  try {
    const response = await fetch(`${API_URL}/admin-auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Admin register error:', error);
    throw error;
  }
};

// ===== ADMIN LOGIN =====
export const adminLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/admin-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// ===== ADMIN FORGOT PASSWORD =====
export const adminForgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/admin-auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Admin forgot password error:', error);
    throw error;
  }
};

// ===== ADMIN VERIFY OTP =====
export const adminVerifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_URL}/admin-auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Admin verify OTP error:', error);
    throw error;
  }
};

// ===== ADMIN RESET PASSWORD =====
export const adminResetPassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/admin-auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Admin reset password error:', error);
    throw error;
  }
};

// ===== ADMIN VERIFY TOKEN =====
export const adminVerifyToken = async () => {
  try {
    const token = getAdminToken();
    if (!token) throw new Error('No token found');
    
    const response = await fetch(`${API_URL}/admin-auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.message === 'No token found' || error.message === 'Invalid token') {
      adminLogout();
    }
    throw error;
  }
};

// ===== TOKEN MANAGEMENT =====
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const getAdminUser = () => {
  try {
    return JSON.parse(localStorage.getItem('adminUser'));
  } catch {
    return null;
  }
};

export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const isAdminAuthenticated = () => {
  return !!getAdminToken();
};