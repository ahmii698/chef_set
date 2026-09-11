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
  <div className="admin_testimonial_stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={16}
        className={i <= count ? "admin_testimonial_star filled" : "admin_testimonial_star"}
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
    <div className="admin_testimonial_layout">
      <div className={`admin_testimonial_sidebar_wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="admin_testimonial_main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="admin_testimonial_content">
          {/* Header */}
          <div className="admin_testimonial_header">
            <div>
              <h1 className="admin_testimonial_title">Testimonials Management</h1>
              <div className="admin_testimonial_breadcrumb">
                <span>Dashboard</span>
                <span className="admin_testimonial_breadcrumb_sep">›</span>
                <span className="admin_testimonial_breadcrumb_active">Testimonials</span>
              </div>
            </div>
            <button className="admin_testimonial_btn_primary" onClick={handleAddNew}>
              <Plus size={16} />
              Add New Testimonial
            </button>
          </div>

          {/* Stats Cards - 3 Only */}
          <div className="admin_testimonial_stats_grid">
            <div className="admin_testimonial_stat_card">
              <div className="admin_testimonial_stat_icon">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="admin_testimonial_stat_label">Total Testimonials</p>
                <h2 className="admin_testimonial_stat_value">{stats.totalTestimonials}</h2>
                <p className="admin_testimonial_stat_sub">All Testimonials</p>
              </div>
            </div>

            <div className="admin_testimonial_stat_card">
              <div className="admin_testimonial_stat_icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="admin_testimonial_stat_label">Active Testimonials</p>
                <h2 className="admin_testimonial_stat_value">{stats.activeTestimonials}</h2>
                <p className="admin_testimonial_stat_sub green">Showing on Website</p>
              </div>
            </div>

            <div className="admin_testimonial_stat_card">
              <div className="admin_testimonial_stat_icon">
                <EyeOff size={20} />
              </div>
              <div>
                <p className="admin_testimonial_stat_label">Inactive Testimonials</p>
                <h2 className="admin_testimonial_stat_value">{stats.inactiveTestimonials}</h2>
                <p className="admin_testimonial_stat_sub red">Hidden from Website</p>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="admin_testimonial_filters_row">
            <div className="admin_testimonial_table_search">
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
              className="admin_testimonial_select_input"
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
              className="admin_testimonial_select_input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Latest">Sort by: Latest</option>
              <option value="Oldest">Sort by: Oldest</option>
              <option value="Rating">Sort by: Rating</option>
            </select>

            <button className="admin_testimonial_btn_filter" onClick={fetchTestimonials} title="Refresh">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="admin_testimonial_table_wrapper">
            <table className="admin_testimonial_table">
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
                      <td className="admin_testimonial_name_cell">{t.name}</td>
                      <td className="admin_testimonial_profession_cell">{t.role}</td>
                      <td className="admin_testimonial_text_cell">
                        "{t.text.length > 60 ? t.text.substring(0, 60) + '...' : t.text}"
                      </td>
                      <td>
                        <Stars count={t.rating || 5} />
                      </td>
                      <td>
                        <span
                          className={`admin_testimonial_status_badge ${t.isActive ? "active" : "inactive"}`}
                          onClick={() => handleToggle(t)}
                          style={{ cursor: 'pointer' }}
                          title="Click to toggle"
                        >
                          {t.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <p className="admin_testimonial_date_cell">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                        <p className="admin_testimonial_time_cell">
                          {new Date(t.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </td>
                      <td>
                        <div className="admin_testimonial_action_btns">
                          <button
                            className="admin_testimonial_icon_btn edit"
                            onClick={() => handleEdit(t)}
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="admin_testimonial_icon_btn delete"
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
          <div className="admin_testimonial_pagination_row">
            <p>
              Showing {filtered.length === 0 ? 0 : startIdx + 1} to{" "}
              {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} testimonials
            </p>
            <div className="admin_testimonial_pagination_controls">
              <button
                className="admin_testimonial_page_btn"
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
                      <span className="admin_testimonial_page_dots">...</span>
                    )}
                    <button
                      className={`admin_testimonial_page_btn ${safePage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  </React.Fragment>
                ))}
              <button
                className="admin_testimonial_page_btn"
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
        <div className="admin_testimonial_modal_overlay" onClick={closeModal}>
          <div className="admin_testimonial_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="admin_testimonial_modal_header">
              <div>
                <h2>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h2>
                <p className="admin_testimonial_modal_subtitle">
                  {editingId ? "Update testimonial details" : "Fill in the details below"}
                </p>
              </div>
              <button className="admin_testimonial_modal_close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="admin_testimonial_modal_body">
              <div className="admin_testimonial_form_group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Chef Michael Rodriguez"
                />
              </div>

              <div className="admin_testimonial_form_group">
                <label>Role / Profession *</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Executive Chef, Michelin Star Restaurant"
                />
              </div>

              <div className="admin_testimonial_form_group">
                <label>Testimonial Text *</label>
                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  placeholder="Write the testimonial here..."
                  rows={4}
                />
              </div>

              <div className="admin_testimonial_form_row_2">
                <div className="admin_testimonial_form_group">
                  <label>Rating</label>
                  <Stars
                    count={form.rating}
                    interactive
                    onChange={(val) => setForm(prev => ({ ...prev, rating: val }))}
                  />
                </div>

                <div className="admin_testimonial_form_group">
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

              <div className="admin_testimonial_form_group admin_testimonial_toggle_group">
                <label className="admin_testimonial_switch_label">
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

            <div className="admin_testimonial_modal_footer">
              <button className="admin_testimonial_cancel_btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="admin_testimonial_save_btn" onClick={handleSave} disabled={saving}>
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