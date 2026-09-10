// src/admin/pages/Testimonials.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Plus, Star, Edit, Trash2, MessageSquare,
  CheckCircle, EyeOff, X, RefreshCw, Save
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  toggleTestimonialStatus,
  deleteTestimonial
} from "../services/adminTestimonialService";
import "./Testimonials.css";

// ===== Stars Component =====
const Stars = ({ count, interactive = false, onChange }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={16}
        className={i <= count ? "star filled" : "star"}
        fill={i <= count ? "#e6a730" : "none"}
        onClick={interactive ? () => onChange(i) : undefined}
        style={interactive ? { cursor: 'pointer' } : undefined}
      />
    ))}
  </div>
);

// ===== Empty Form =====
const emptyForm = {
  name: "",
  role: "",
  text: "",
  rating: 5,
  isActive: true,
  order: 0
};

const ITEMS_PER_PAGE = 10;

const Testimonials = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    activeTestimonials: 0,
    inactiveTestimonials: 0
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // ===== FETCH =====
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getAllTestimonials();
      setTestimonials(data.testimonials || []);
      setStats(data.stats || {
        totalTestimonials: 0,
        activeTestimonials: 0,
        inactiveTestimonials: 0
      });
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ===== FILTER & SORT =====
  const filtered = useMemo(() => {
    let list = testimonials.filter((t) => {
      const matchesSearch =
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.role?.toLowerCase().includes(search.toLowerCase()) ||
        t.text?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && t.isActive) ||
        (statusFilter === "Inactive" && !t.isActive);
      return matchesSearch && matchesStatus;
    });

    if (sortBy === "Oldest") {
      list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "Rating") {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [testimonials, search, statusFilter, sortBy]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ===== MODAL: OPEN ADD =====
  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  // ===== MODAL: OPEN EDIT =====
  const handleEdit = (t) => {
    setForm({
      name: t.name,
      role: t.role,
      text: t.text,
      rating: t.rating || 5,
      isActive: t.isActive,
      order: t.order || 0
    });
    setEditingId(t._id);
    setShowModal(true);
  };

  // ===== MODAL: CLOSE =====
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ===== FORM CHANGE =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ===== SAVE =====
  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.text.trim()) {
      toast.error("Name, Role, and Testimonial Text are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const result = await updateTestimonial(editingId, form);
        toast.success(result.message || 'Testimonial updated!');
      } else {
        const result = await createTestimonial(form);
        toast.success(result.message || 'Testimonial created!');
      }
      closeModal();
      fetchTestimonials();
    } catch (error) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ===== TOGGLE STATUS =====
  const handleToggle = async (t) => {
    try {
      const result = await toggleTestimonialStatus(t._id);
      toast.success(result.message || 'Status updated!');
      setTestimonials(prev =>
        prev.map(item =>
          item._id === t._id ? { ...item, isActive: !item.isActive } : item
        )
      );
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  // ===== DELETE =====
  const handleDelete = (t) => {
    toast((toastItem) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Delete this testimonial?</span>
        <span style={{ fontSize: '12px', color: '#999' }}>
          "{t.name}" will be permanently removed.
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
                await deleteTestimonial(t._id);
                toast.success('Testimonial deleted! 🗑️');
                setTestimonials(prev => prev.filter(x => x._id !== t._id));
                fetchTestimonials();
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
    <div className="testimonials-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="testimonials-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="testimonials-content">
          {/* Header */}
          <div className="testimonials-header">
            <div>
              <h1 className="testimonials-title">Testimonials Management</h1>
              <div className="testimonials-breadcrumb">
                <span>Dashboard</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-active">Testimonials</span>
              </div>
            </div>
            <button className="btn-primary" onClick={handleAddNew}>
              <Plus size={16} />
              Add New Testimonial
            </button>
          </div>

          {/* Stats Cards - 3 Only */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="stat-label">Total Testimonials</p>
                <h2 className="stat-value">{stats.totalTestimonials}</h2>
                <p className="stat-sub">All Testimonials</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="stat-label">Active Testimonials</p>
                <h2 className="stat-value">{stats.activeTestimonials}</h2>
                <p className="stat-sub green">Showing on Website</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <EyeOff size={20} />
              </div>
              <div>
                <p className="stat-label">Inactive Testimonials</p>
                <h2 className="stat-value">{stats.inactiveTestimonials}</h2>
                <p className="stat-sub red">Hidden from Website</p>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="filters-row">
            <div className="table-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search testimonials..."
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

            <select
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Latest">Sort by: Latest</option>
              <option value="Oldest">Sort by: Oldest</option>
              <option value="Rating">Sort by: Rating</option>
            </select>

            <button className="btn-filter" onClick={fetchTestimonials} title="Refresh">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="testimonials-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Testimonial</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                      Loading testimonials...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                      No testimonials found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((t, index) => (
                    <tr key={t._id}>
                      <td>{startIdx + index + 1}</td>
                      <td className="name-cell">{t.name}</td>
                      <td className="profession-cell">{t.role}</td>
                      <td className="testimonial-text-cell">
                        "{t.text.length > 60 ? t.text.substring(0, 60) + '...' : t.text}"
                      </td>
                      <td>
                        <Stars count={t.rating || 5} />
                      </td>
                      <td>
                        <span
                          className={`status-badge ${t.isActive ? "active" : "inactive"}`}
                          onClick={() => handleToggle(t)}
                          style={{ cursor: 'pointer' }}
                          title="Click to toggle"
                        >
                          {t.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <p className="date-cell">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                        <p className="time-cell">
                          {new Date(t.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="icon-btn edit"
                            onClick={() => handleEdit(t)}
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDelete(t)}
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
              {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} testimonials
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
                <h2>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
                <p className="modal-subtitle">
                  {editingId ? "Update testimonial details" : "Fill in the details below"}
                </p>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Chef Michael Rodriguez"
                />
              </div>

              <div className="form-group">
                <label>Role / Profession *</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Executive Chef, Michelin Star Restaurant"
                />
              </div>

              <div className="form-group">
                <label>Testimonial Text *</label>
                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  placeholder="Write the testimonial here..."
                  rows={4}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Rating</label>
                  <Stars
                    count={form.rating}
                    interactive
                    onChange={(val) => setForm(prev => ({ ...prev, rating: val }))}
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

export default Testimonials;