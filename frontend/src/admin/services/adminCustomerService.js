// src/admin/services/adminCustomerService.js
import { API_URL } from "../../../config";
import { getAdminToken } from "./adminAuthService";

// ===== GET ALL CUSTOMERS (Admin) =====
export const getAllCustomers = async () => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-users/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch customers');
    return await response.json();
  } catch (error) {
    console.error('Fetch customers error:', error);
    throw error;
  }
};

// ===== GET SINGLE CUSTOMER =====
export const getCustomerById = async (userId) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch customer');
    return await response.json();
  } catch (error) {
    console.error('Fetch customer error:', error);
    throw error;
  }
};

// ===== DELETE CUSTOMER =====
export const deleteCustomer = async (userId) => {
  try {
    const token = getAdminToken();
    const response = await fetch(`${API_URL}/admin-users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete customer');
    return await response.json();
  } catch (error) {
    console.error('Delete customer error:', error);
    throw error;
  }
};