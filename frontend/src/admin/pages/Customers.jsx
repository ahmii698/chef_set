// src/admin/pages/Customers.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, Calendar, Eye, Trash2, ChevronLeft, ChevronRight,
  Users, UserCheck, UserX, Briefcase, Download, X, Mail, Phone,
  ShoppingBag, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getAllCustomers, getCustomerById, deleteCustomer } from "../services/adminCustomerService";
import { STORAGE_URL } from "../../../config";
import "./Customers.css";

const statusOptions = ["All Status", "Active", "Inactive"];
const ITEMS_PER_PAGE = 10;

const statusClassMap = {
  Active: "cust-status-active",
  Inactive: "cust-status-inactive",
};

export default function CustomerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    totalRevenue: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ===== FETCH CUSTOMERS =====
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data.customers || []);
      setStats(data.stats || {
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        totalRevenue: 0,
      });
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ===== FILTER =====
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ===== VIEW CUSTOMER =====
  const handleView = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingDetails(true);
    try {
      const data = await getCustomerById(customer._id);
      setCustomerOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load customer details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setCustomerOrders([]);
  };

  // ===== DELETE CUSTOMER =====
  const handleDelete = (customer) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Delete this customer?</span>
        <span style={{ fontSize: '12px', color: '#999' }}>
          {customer.fullName} will be permanently removed.
        </span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '6px 14px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px', color: '#fff',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteCustomer(customer._id);
                toast.success('Customer deleted! 🗑️');
                setCustomers(prev => prev.filter(c => c._id !== customer._id));
                if (selectedCustomer?._id === customer._id) closeModal();
                fetchCustomers();
              } catch (error) {
                toast.error('Failed to delete customer');
              }
            }}
            style={{
              padding: '6px 14px', background: '#e5484d',
              border: 'none', borderRadius: '6px', color: '#fff',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      style: {
        background: '#17171c', color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px', padding: '16px', maxWidth: '320px',
      },
    });
  };

  // ===== EXPORT =====
  const handleExport = () => {
    if (customers.length === 0) {
      toast.error("No customers to export");
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Status', 'Joined'];
    const rows = customers.map(c => [
      c.fullName,
      c.email,
      c.phone,
      c.totalOrders,
      c.totalSpent,
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Customers exported! 📥');
  };

  return (
    <div className="cust-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="cust-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="cust-content">
          {/* Header */}
          <div className="cust-header">
            <div>
              <h1 className="cust-title">Customers</h1>
              <div className="cust-breadcrumb">
                <span>Dashboard</span>
                <span className="cust-breadcrumb-sep">›</span>
                <span className="cust-breadcrumb-current">Customers</span>
              </div>
            </div>
            <button className="cust-btn-primary" onClick={handleExport}>
              <Download size={16} strokeWidth={2.5} />
              Export Customers
            </button>
          </div>

          {/* Stats Cards */}
          <div className="cust-stats-grid">
            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <Users size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Total Customers</div>
                <div className="cust-stat-value">{stats.totalCustomers}</div>
                <div className="cust-stat-sub cust-stat-up">All registered users</div>
              </div>
            </div>

            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <UserCheck size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Active Customers</div>
                <div className="cust-stat-value">{stats.activeCustomers}</div>
                <div className="cust-stat-sub cust-stat-up">Placed at least 1 order</div>
              </div>
            </div>

            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <UserX size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Inactive Customers</div>
                <div className="cust-stat-value">{stats.inactiveCustomers}</div>
                <div className="cust-stat-sub cust-stat-down">No orders yet</div>
              </div>
            </div>

            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Total Revenue</div>
                <div className="cust-stat-value">PKR {stats.totalRevenue.toLocaleString()}</div>
                <div className="cust-stat-sub cust-stat-up">All time</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="cust-filters">
            <div className="cust-search">
              <Search size={16} className="cust-search-icon" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="cust-filter-select"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="cust-table-wrapper">
            <table className="cust-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Joined At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="cust-empty">Loading customers...</td>
                  </tr>
                ) : paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="cust-empty">No customers found.</td>
                  </tr>
                ) : (
                  paginatedCustomers.map((c, idx) => (
                    <tr key={c._id}>
                      <td>{startIdx + idx + 1}</td>
                      <td>
                        <div className="cust-customer-cell">
                          <div className="cust-avatar-placeholder">
                            {c.fullName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <span className="cust-name">{c.fullName}</span>
                        </div>
                      </td>
                      <td className="cust-muted">{c.email}</td>
                      <td className="cust-muted">{c.phone}</td>
                      <td>{c.totalOrders}</td>
                      <td className="cust-total">PKR {c.totalSpent.toLocaleString()}</td>
                      <td>
                        <span className={`cust-status-badge ${statusClassMap[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="cust-muted">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="cust-actions">
                          <button
                            className="cust-action-btn cust-view-btn"
                            onClick={() => handleView(c)}
                            aria-label="View customer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="cust-action-btn cust-delete-btn"
                            onClick={() => handleDelete(c)}
                            aria-label="Delete customer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="cust-pagination-bar">
            <span className="cust-showing">
              Showing {filteredCustomers.length === 0 ? 0 : startIdx + 1} to{" "}
              {Math.min(startIdx + ITEMS_PER_PAGE, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} customers
            </span>
            <div className="cust-pagination-controls">
              <button
                className="cust-page-btn"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => num === 1 || num === totalPages || Math.abs(num - safePage) <= 1)
                .map((num, idx, arr) => (
                  <React.Fragment key={num}>
                    {idx > 0 && arr[idx - 1] !== num - 1 && <span className="cust-page-dots">...</span>}
                    <button
                      className={`cust-page-num ${safePage === num ? "cust-page-num-active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className="cust-page-btn"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CUSTOMER DETAILS MODAL ===== */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedCustomer.fullName}</h2>
                <p className="modal-subtitle">
                  Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Info */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <UserCheck size={16} /> Customer Information
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{selectedCustomer.fullName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{selectedCustomer.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{selectedCustomer.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <span className={`cust-status-badge ${statusClassMap[selectedCustomer.status]}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <Briefcase size={16} /> Purchase Summary
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Total Orders</span>
                    <span className="info-value">{selectedCustomer.totalOrders}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Total Spent</span>
                    <span className="info-value" style={{ color: '#f5a623' }}>
                      PKR {selectedCustomer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <ShoppingBag size={16} /> Order History ({customerOrders.length})
                </h3>
                {loadingDetails ? (
                  <div className="no-proof">Loading orders...</div>
                ) : customerOrders.length === 0 ? (
                  <div className="no-proof">No orders placed yet</div>
                ) : (
                  <div className="order-items-list">
                    {customerOrders.slice(0, 5).map((order) => (
                      <div className="order-item" key={order._id}>
                        <div className="order-item-info">
                          <span className="order-item-name">#{order.orderId}</span>
                          <span className="order-item-qty">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} items
                          </span>
                        </div>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status?.toUpperCase()}
                        </span>
                        <div className="order-item-total">
                          PKR {order.total?.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {customerOrders.length > 5 && (
                      <div style={{ textAlign: 'center', padding: '12px', color: '#888', fontSize: '12px' }}>
                        + {customerOrders.length - 5} more orders
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="delete-order-btn"
                onClick={() => handleDelete(selectedCustomer)}
              >
                <Trash2 size={16} /> Delete Customer
              </button>
              <button className="close-modal-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}