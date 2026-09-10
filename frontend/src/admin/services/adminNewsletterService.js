// src/admin/services/adminNewsletterService.js
import { API_URL } from "../../../config";
import { getAdminToken } from "./adminAuthService";

// ===== GET ALL SUBSCRIBERS =====
export const getAllSubscribers = async () => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-newsletter/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch subscribers');
    return await response.json();
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    throw error;
  }
};

// ===== DELETE SUBSCRIBER =====
export const deleteSubscriber = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-newsletter/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete subscriber');
    return await response.json();
  } catch (error) {
    console.error('Delete subscriber error:', error);
    throw error;
  }
};