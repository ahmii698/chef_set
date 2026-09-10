// src/admin/services/adminFaqService.js
import { API_URL } from "../../../config";
import { getAdminToken } from "./adminAuthService";

// ===== GET ALL FAQs =====
export const getAllFaqs = async () => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-faq/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch FAQs');
    return await response.json();
  } catch (error) {
    console.error('Fetch FAQs error:', error);
    throw error;
  }
};

// ===== CREATE FAQ =====
export const createFaq = async (data) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-faq`, {
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
    console.error('Create FAQ error:', error);
    throw error;
  }
};

// ===== UPDATE FAQ =====
export const updateFaq = async (id, data) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-faq/${id}`, {
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
    console.error('Update FAQ error:', error);
    throw error;
  }
};

// ===== TOGGLE STATUS =====
export const toggleFaqStatus = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-faq/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to toggle');
    return await response.json();
  } catch (error) {
    console.error('Toggle FAQ error:', error);
    throw error;
  }
};

// ===== UPDATE ORDER =====
export const updateFaqOrder = async (id, order) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-faq/${id}/order`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ order })
    });
    if (!response.ok) throw new Error('Failed to update order');
    return await response.json();
  } catch (error) {
    console.error('Update order error:', error);
    throw error;
  }
};

// ===== DELETE FAQ =====
export const deleteFaq = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-faq/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Delete FAQ error:', error);
    throw error;
  }
};