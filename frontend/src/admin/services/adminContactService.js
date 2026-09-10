// src/admin/services/adminContactService.js
import { API_URL } from "../../../config";
import { getAdminToken } from "./adminAuthService";

// ===== GET ALL MESSAGES =====
export const getAllContactMessages = async () => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-contact-messages/all`, {  // ✅ URL Updated
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  } catch (error) {
    console.error('Fetch messages error:', error);
    throw error;
  }
};

// ===== UPDATE STATUS =====
export const updateMessageStatus = async (id, status) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-contact-messages/${id}/status`, {  // ✅ URL Updated
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};

// ===== DELETE MESSAGE =====
export const deleteContactMessage = async (id) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-contact-messages/${id}`, {  // ✅ URL Updated
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};