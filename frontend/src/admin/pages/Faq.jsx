// src/admin/pages/FAQ.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, Plus, Edit, Trash2, HelpCircle,
  CheckCircle, EyeOff, LayoutGrid, RefreshCw, X, Save
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getAllFaqs, createFaq, updateFaq,
  toggleFaqStatus, updateFaqOrder, deleteFaq
} from "../services/adminFaqService";
import "./Faq.css";

const emptyForm = {
  question: "",
  answer: "",
  isActive: true,
  order: 0,
  category: "General"
};

const ITEMS_PER_PAGE = 10;

const FAQ = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFaqs: 0,
    activeFaqs: 0,
    inactiveFaqs: 0
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // ===== FETCH =====
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await getAllFaqs();
      setFaqs(data.faqs || []);
      setStats(data.stats || { totalFaqs: 0, activeFaqs: 0, inactiveFaqs: 0 });
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // ===== FILTER =====
  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchesSearch =
        f.question?.toLowerCase().includes(search.toLowerCase()) ||
        f.answer?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && f.isActive) ||
        (statusFilter === "Inactive" && !f.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [faqs, search, statusFilter]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ===== MODAL =====
  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      order: faq.order || 0,
      category: faq.category || "General"
    });
    setEditingId(faq._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const result = await updateFaq(editingId, form);
        toast.success(result.message || 'FAQ updated!');
      } else {
        const result = await createFaq(form);
        toast.success(result.message || 'FAQ created!');
      }
      closeModal();
      fetchFaqs();
    } catch (error) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ===== TOGGLE =====
  const handleToggle = async (faq) => {
    try {
      const result = await toggleFaqStatus(faq._id);
      toast.success(result.message || 'Status updated!');
      setFaqs(prev =>
        prev.map(f => f._id === faq._id ? { ...f, isActive: !f.isActive } : f)
      );
      fetchFaqs();
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  // ===== ORDER CHANGE =====
  const handleOrderChange = async (faq, value) => {
    try {
      await updateFaqOrder(faq._id, value);
      setFaqs(prev =>
        prev.map(f => f._id === faq._id ? { ...f, order: Number(value) } : f)
      );
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  // ===== DELETE =====
  const handleDelete = (faq) => {
    toast((toastItem) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Delete this FAQ?</span>
        <span style={{ fontSize: '12px', color: '#999' }}>
          "{faq.question.substring(0, 50)}..." will be permanently removed.
        </span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => toast.dismiss(toastItem.id)}
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
              toast.dismiss(toastItem.id);
              try {
                await deleteFaq(faq._id);
                toast.success('FAQ deleted! 🗑️');
                setFaqs(prev => prev.filter(x => x._id !== faq._id));
                fetchFaqs();
              } catch (error) {
                toast.error('Failed to delete');
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

  return (
    <div className="faq-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="faq-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="admin-faq-content">
          {/* Header */}
          <div className="faq-header">
            <div>
              <h1 className="faq-title">FAQ Management</h1>
              <div className="faq-breadcrumb">
                <span>Dashboard</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-active">FAQ</span>
              </div>
            </div>
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={16} />
              Add New FAQ
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <HelpCircle size={20} />
              </div>
              <div>
                <p className="stat-label">Total FAQs</p>
                <h2 className="stat-value">{stats.totalFaqs}</h2>
                <p className="stat-sub">All Questions</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="stat-label">Active FAQs</p>
                <h2 className="stat-value">{stats.activeFaqs}</h2>
                <p className="stat-sub green">Visible on Website</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <EyeOff size={20} />
              </div>
              <div>
                <p className="stat-label">Inactive FAQs</p>
                <h2 className="stat-value">{stats.inactiveFaqs}</h2>
                <p className="stat-sub red">Hidden from Website</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <LayoutGrid size={20} />
              </div>
              <div>
                <p className="stat-label">Display Order</p>
                <h2 className="stat-value">Manual</h2>
                <p className="stat-sub">Change below</p>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="filters-row">
            <div className="table-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by question or answer..."
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
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button className="btn-filter" onClick={fetchFaqs}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="faq-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Answer (Preview)</th>
                  <th>Status</th>
                  <th>Display Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                      Loading FAQs...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                      No FAQs found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((f, index) => (
                    <tr key={f._id}>
                      <td>{startIdx + index + 1}</td>
                      <td className="question-cell">{f.question}</td>
                      <td className="answer-cell">
                        {f.answer.length > 100
                          ? f.answer.substring(0, 100) + '...'
                          : f.answer}
                      </td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={f.isActive}
                            onChange={() => handleToggle(f)}
                          />
                          <span className="slider" />
                        </label>
                        <span className={`status-text ${f.isActive ? "active" : "inactive"}`}>
                          {f.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="order-input"
                          value={f.order}
                          onChange={(e) => handleOrderChange(f, e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="icon-btn edit"
                            onClick={() => handleEdit(f)}
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDelete(f)}
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
              {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} FAQs
            </p>
            <div className="pagination-controls">
              <button
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingId ? "Edit FAQ" : "Add New FAQ"}</h2>
                <p className="modal-subtitle">
                  {editingId ? "Update FAQ details" : "Fill in the details below"}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Question *</label>
                <input
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="e.g. What is Chefset?"
                />
              </div>

              <div className="form-group">
                <label>Answer *</label>
                <textarea
                  name="answer"
                  value={form.answer}
                  onChange={handleChange}
                  placeholder="Write the answer here..."
                  rows={5}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. General"
                  />
                </div>

                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group toggle-group">
                <label className="switch-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                  <span>Show on Website (Active)</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                <Save size={16} />
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;