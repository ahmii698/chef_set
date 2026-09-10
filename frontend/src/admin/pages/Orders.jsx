// src/admin/pages/Orders.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, Calendar, Eye, ChevronLeft, ChevronRight,
  Briefcase, Package, CheckCircle, X, Trash2, RefreshCw,
  User, CreditCard, ShoppingBag, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getAllOrders, updateOrderStatus, deleteOrder, getProofUrl } from "../services/adminOrderService";
import { STORAGE_URL } from "../../../config";
import "./Orders.css";

// ===== Status Config =====
const statusOptions = [
  { value: "All Status", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusClassMap = {
  delivered: "status-delivered",
  processing: "status-processing",
  shipped: "status-shipped",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ===== FETCH ORDERS =====
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data.orders || []);
      setStats(data.stats || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        cancelledOrders: 0,
      });
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===== FILTER ORDERS =====
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        order.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ===== VIEW ORDER =====
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // ===== UPDATE STATUS =====
  const handleStatusUpdate = async (orderId, newStatus, newPaymentStatus) => {
    setUpdating(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus, newPaymentStatus);
      toast.success(result.message || 'Order updated successfully!');
      
      // Update local state
      setOrders(prev => prev.map(o => 
        o.orderId === orderId 
          ? { ...o, status: newStatus || o.status, paymentStatus: newPaymentStatus || o.paymentStatus }
          : o
      ));
      
      // Update selected order
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: newStatus || prev.status,
          paymentStatus: newPaymentStatus || prev.paymentStatus
        }));
      }

      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  // ===== DELETE ORDER =====
  const handleDeleteOrder = (orderId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Delete this order?</span>
        <span style={{ fontSize: '12px', color: '#999' }}>This action cannot be undone.</span>
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
                await deleteOrder(orderId);
                toast.success('Order deleted successfully! 🗑️');
                setOrders(prev => prev.filter(o => o.orderId !== orderId));
                closeModal();
                fetchOrders();
              } catch (error) {
                toast.error('Failed to delete order');
              }
            }}
            style={{
              padding: '6px 14px', background: '#e05a3f',
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
        borderRadius: '10px', padding: '16px', maxWidth: '300px',
      },
    });
  };

  return (
    <div className="orders-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="orders-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="orders-content">
          {/* Header */}
          <div className="orders-header">
            <h1 className="orders-title">Orders</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                className="refresh-btn"
                onClick={fetchOrders}
                title="Refresh"
              >
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
              </button>
              <div className="orders-search">
                <Search size={16} className="orders-search-icon" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <Briefcase size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Orders</p>
                <h2 className="stat-value">{stats.totalOrders}</h2>
                <span className="stat-change positive">All time</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <Package size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Revenue</p>
                <h2 className="stat-value">PKR {stats.totalRevenue.toLocaleString()}</h2>
                <span className="stat-change positive">All time</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <Briefcase size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending Orders</p>
                <h2 className="stat-value">{stats.pendingOrders}</h2>
                <span className="stat-change neutral">Awaiting approval</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <CheckCircle size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Completed Orders</p>
                <h2 className="stat-value">{stats.completedOrders}</h2>
                <span className="stat-change positive">Delivered</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="orders-filters">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th className="action-col">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="no-results">Loading orders...</td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-results">No orders found.</td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">#{order.orderId}</td>
                      <td>
                        <div className="customer-cell">
                          <span className="customer-name">{order.fullName}</span>
                          <span className="customer-email">{order.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="date-time">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="order-total">PKR {order.total?.toLocaleString()}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span className={`status-badge ${statusClassMap[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${order.paymentStatus === 'paid' ? 'status-delivered' : 'status-pending'}`}>
                          {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleViewOrder(order)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="orders-pagination">
            <span className="pagination-info">
              Showing {filteredOrders.length === 0 ? 0 : startIdx + 1} to{" "}
              {Math.min(startIdx + ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </span>
            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => num === 1 || num === totalPages || Math.abs(num - safePage) <= 1)
                .map((num, idx, arr) => (
                  <React.Fragment key={num}>
                    {idx > 0 && arr[idx - 1] !== num - 1 && <span className="page-dots">...</span>}
                    <button
                      className={`page-btn ${safePage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className="page-btn"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ORDER DETAILS MODAL ===== */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2>Order #{selectedOrder.orderId}</h2>
                <p className="modal-subtitle">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {/* Status Update */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <CheckCircle2 size={16} /> Update Status
                </h3>
                <div className="status-update-grid">
                  <div className="status-update-item">
                    <label>Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder.orderId, e.target.value, null)}
                      disabled={updating}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="status-update-item">
                    <label>Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleStatusUpdate(selectedOrder.orderId, null, e.target.value)}
                      disabled={updating}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <User size={16} /> Customer Information
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value">{selectedOrder.fullName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{selectedOrder.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{selectedOrder.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">City</span>
                    <span className="info-value">{selectedOrder.city}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Address</span>
                    <span className="info-value">
                      {selectedOrder.address} {selectedOrder.zipcode && `- ${selectedOrder.zipcode}`}
                    </span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="info-item full-width">
                      <span className="info-label">Notes</span>
                      <span className="info-value">{selectedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <ShoppingBag size={16} /> Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item, idx) => (
                    <div className="order-item" key={idx}>
                      <div className="order-item-image">
                        {item.image && (
                          <img 
                            src={`${STORAGE_URL}/${item.image}`} 
                            alt={item.name}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">Qty: {item.qty} × PKR {item.price?.toLocaleString()}</span>
                      </div>
                      <div className="order-item-total">
                        PKR {(item.qty * item.price)?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>PKR {selectedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="total-row">
                    <span>Shipping</span>
                    <span>PKR {selectedOrder.shipping?.toLocaleString() || 0}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total</span>
                    <span>PKR {selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Proof */}
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <CreditCard size={16} /> Payment Proof
                </h3>
                <div className="payment-info">
                  <span className="info-label">Method:</span>
                  <span className="info-value">{selectedOrder.paymentMethod}</span>
                </div>
                {selectedOrder.paymentProof ? (
                  <div className="payment-proof-container">
                    <img 
                      src={getProofUrl(selectedOrder.paymentProof)} 
                      alt="Payment Proof"
                      className="payment-proof-image"
                      onError={(e) => { 
                        e.target.outerHTML = '<div style="padding:20px;text-align:center;color:#666;">Failed to load image</div>'; 
                      }}
                    />
                    <a 
                      href={getProofUrl(selectedOrder.paymentProof)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-full-btn"
                    >
                      View Full Image
                    </a>
                  </div>
                ) : (
                  <div className="no-proof">No payment proof uploaded yet</div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button 
                className="delete-order-btn" 
                onClick={() => handleDeleteOrder(selectedOrder.orderId)}
              >
                <Trash2 size={16} /> Delete Order
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
};

export default Orders;