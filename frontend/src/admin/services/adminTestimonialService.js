// src/admin/services/adminTestimonialService.js
import { API_URL } from "../../../config";
import { getAdminToken } from "./adminAuthService";

// ===== GET ALL TESTIMONIALS =====
export const getAllTestimonials = async () => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-testimonials/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return await response.json();
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    throw error;
  }
};

// ===== GET SINGLE =====
export const getTestimonialById = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-testimonials/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch testimonial');
    return await response.json();
  } catch (error) {
    console.error('Fetch testimonial error:', error);
    throw error;
  }
};

// ===== CREATE =====
export const createTestimonial = async (data) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create');
    }
    return await response.json();
  } catch (error) {
    console.error('Create testimonial error:', error);
    throw error;
  }
};

// ===== UPDATE =====
export const updateTestimonial = async (id, data) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-testimonials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to update');
    }
    return await response.json();
  } catch (error) {
    console.error('Update testimonial error:', error);
    throw error;
  }
};

// ===== TOGGLE STATUS =====
export const toggleTestimonialStatus = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-testimonials/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to toggle');
    return await response.json();
  } catch (error) {
    console.error('Toggle testimonial error:', error);
    throw error;
  }
};

// ===== DELETE =====
export const deleteTestimonial = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-testimonials/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Delete testimonial error:', error);
    throw error;
  }
};