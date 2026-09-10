// src/admin/services/adminOrderService.js
import { API_URL, STORAGE_URL } from "../../../config";
import { getAdminToken } from "./adminAuthService";

// ===== GET ALL ORDERS (Admin) =====
export const getAllOrders = async () => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-orders/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return await response.json();
  } catch (error) {
    console.error('Fetch orders error:', error);
    throw error;
  }
};

// ===== UPDATE ORDER STATUS =====
export const updateOrderStatus = async (orderId, status, paymentStatus) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, paymentStatus })
    });
    if (!response.ok) throw new Error('Failed to update order');
    return await response.json();
  } catch (error) {
    console.error('Update order error:', error);
    throw error;
  }
};

// ===== DELETE ORDER =====
export const deleteOrder = async (orderId) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete order');
    return await response.json();
  } catch (error) {
    console.error('Delete order error:', error);
    throw error;
  }
};

// ===== GET PROOF URL =====
export const getProofUrl = (proofPath) => {
  if (!proofPath) return null;
  const baseUrl = STORAGE_URL.replace('/storage', '');
  return `${baseUrl}${proofPath}`;
};