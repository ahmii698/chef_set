// src/admin/pages/ContactUs.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Mail, RefreshCw, Trash2, Eye, X, Clock
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage
} from "../services/adminContactService";
import "./ContactUs.css";

const ITEMS_PER_PAGE = 10;

const statusClassMap = {
  pending: 'contact-status-pending',
  read: 'contact-status-read'
};

const ContactUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    readMessages: 0
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // ===== FETCH MESSAGES =====
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getAllContactMessages();
      setMessages(data.messages || []);
      setStats(data.stats || {
        totalMessages: 0,
        unreadMessages: 0,
        readMessages: 0
      });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ===== FILTER =====
  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchesSearch =
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ===== VIEW MESSAGE (auto mark as read) =====
  const handleView = async (msg) => {
    setSelectedMessage(msg);
    
    if (msg.status === 'pending') {
      try {
        await updateMessageStatus(msg._id, 'read');
        setMessages(prev =>
          prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m)
        );
        setSelectedMessage({ ...msg, status: 'read' });
        fetchMessages();
      } catch (error) {
        console.error('Failed to mark as read');
      }
    }
  };

  const closeModal = () => setSelectedMessage(null);

  // ===== DELETE (Simple & Working) =====
  const handleDelete = async (msg) => {
    console.log('🗑️ Delete clicked:', msg._id, msg.name);

    const confirmed = window.confirm(`Delete message from "${msg.name}"?`);
    if (!confirmed) {
      console.log('❌ Cancelled');
      return;
    }

    try {
      console.log('📤 Sending DELETE request...');
      await deleteContactMessage(msg._id);
      
      console.log('✅ Deleted successfully');
      toast.success('Message deleted! 🗑️');
      
      // Update local state
      setMessages(prev => prev.filter(x => x._id !== msg._id));
      
      // Close modal if open
      if (selectedMessage?._id === msg._id) closeModal();
      
      // Refresh from server
      fetchMessages();
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error(error.message || 'Failed to delete message');
    }
  };

  return (
    <div className="contactus-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="contactus-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="contactus-content">
          {/* Header */}
          <div className="contactus-header">
            <div>
              <h1 className="contactus-title">Contact Us Messages</h1>
              <div className="contactus-breadcrumb">
                <span>Dashboard</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-active">Contact Us</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="contactus-stats">
            <div className="stat-card">
              <div className="stat-icon"><Mail size={20} /></div>
              <div>
                <p className="stat-label">Total Messages</p>
                <h2 className="stat-value">{stats.totalMessages}</h2>
                <p className="stat-sub">All Inquiries</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><Clock size={20} /></div>
              <div>
                <p className="stat-label">Unread</p>
                <h2 className="stat-value">{stats.unreadMessages}</h2>
                <p className="stat-sub red">Pending Review</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><Eye size={20} /></div>
              <div>
                <p className="stat-label">Read</p>
                <h2 className="stat-value">{stats.readMessages}</h2>
                <p className="stat-sub">Viewed</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="table-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="select-input"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>All Status</option>
              <option value="pending">Pending</option>
              <option value="read">Read</option>
            </select>

            <button className="btn-filter" onClick={fetchMessages}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="contactus-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                      Loading messages...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((m, index) => (
                    <tr key={m._id} className={m.status === 'pending' ? 'unread-row' : ''}>
                      <td>{startIdx + index + 1}</td>
                      <td className="name-cell">{m.name}</td>
                      <td className="email-cell">{m.email}</td>
                      <td className="subject-cell">{m.subject || 'No Subject'}</td>
                      <td>
                        <span className={`contact-status ${statusClassMap[m.status]}`}>
                          {m.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="date-cell">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            className="icon-btn view"
                            onClick={() => handleView(m)}
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn delete"
                            onClick={() => handleDelete(m)}
                            title="Delete"
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
          <div className="pagination-row">
            <p>
              Showing {filtered.length === 0 ? 0 : startIdx + 1} to{" "}
              {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} messages
            </p>
            <div className="pagination-controls">
              <button
                type="button"
                className="page-btn"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(num => num === 1 || num === totalPages || Math.abs(num - safePage) <= 1)
                .map((num, idx, arr) => (
                  <React.Fragment key={num}>
                    {idx > 0 && arr[idx - 1] !== num - 1 && (
                      <span className="page-dots">...</span>
                    )}
                    <button
                      type="button"
                      className={`page-btn ${safePage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </React.Fragment>
                ))}
              <button
                type="button"
                className="page-btn"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedMessage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Message Details</h2>
                <p className="modal-subtitle">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{selectedMessage.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{selectedMessage.email}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Subject</span>
                  <span className="info-value">{selectedMessage.subject || 'No Subject'}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Message</span>
                  <span className="info-value">{selectedMessage.message}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`contact-status ${statusClassMap[selectedMessage.status]}`}>
                    {selectedMessage.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;