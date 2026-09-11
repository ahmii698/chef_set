// src/admin/pages/category.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Pencil, Trash2, Plus, Folder, CheckCircle2, EyeOff,
  ChevronLeft, ChevronRight, X, Save, Upload, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { API_URL, STORAGE_URL } from "../../../config";
import "./category.css";

const PER_PAGE_OPTIONS = [10, 20, 50];

export default function CategoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    image: "",
    buttonText: "SHOP NOW",
    order: 0,
  });

  // ===== FETCH DATA FROM API =====
  const fetchHomeCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/home-category`);
      const data = await res.json();
      setHomeData(data);
    } catch (error) {
      toast.error("Failed to load categories", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeCategory();
  }, []);

  const categories = homeData?.categories || [];
  const totalCategories = categories.length;
  const activeCount = homeData?.isActive ? totalCategories : 0;
  const inactiveCount = homeData?.isActive ? 0 : totalCategories;

  const totalPages = Math.max(1, Math.ceil(categories.length / perPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return categories.slice(start, start + perPage);
  }, [categories, page, perPage]);

  // ===== HELPER: Image URL banao =====
  const getImageUrl = (img) => {
    if (!img) return "https://placehold.co/60x60/2a2a2a/f5a623?text=?";
    if (img.startsWith("http")) return img;
    return `${STORAGE_URL}/${img}`;
  };

  // ===== MODAL HANDLERS =====
  const handleAddNew = () => {
    setForm({
      name: "",
      image: "",
      buttonText: "SHOP NOW",
      order: categories.length + 1,
    });
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleEdit = (index) => {
    const cat = categories[index];
    setForm({
      name: cat.name || "",
      image: cat.image || "",
      buttonText: cat.buttonText || "SHOP NOW",
      order: cat.order || 0,
    });
    setEditingIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== IMAGE UPLOAD =====
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Sirf image files allowed hain", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image 5MB se choti honi chahiye", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.filename }));
      toast.success("Image uploaded!", {
        duration: 3000,
        style: {
          background: "#14321e",
          color: "#4ade80",
          border: "1px solid #4ade80",
          fontWeight: "600",
        },
        icon: "🎉",
      });
    } catch (error) {
      toast.error("Image upload nahi hui. Try again.", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
    } finally {
      setUploading(false);
    }
  };

  // ===== SAVE (ADD / EDIT) =====
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Category Name zaroori hai", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
      return;
    }
    if (!form.image) {
      toast.error("Image upload karo", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
      return;
    }

    setSaving(true);
    try {
      const autoLink = `/products?category=${form.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      const categoryData = {
        name: form.name,
        image: form.image,
        link: autoLink,
        buttonText: form.buttonText || "SHOP NOW",
        order: Number(form.order) || 0,
      };

      let updatedCategories = [...categories];

      if (editingIndex !== null) {
        categoryData.link = categories[editingIndex].link || autoLink;
        updatedCategories[editingIndex] = categoryData;
      } else {
        updatedCategories.push(categoryData);
      }

      updatedCategories.sort((a, b) => a.order - b.order);

      const res = await fetch(`${API_URL}/home-category/${homeData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: updatedCategories }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const savedData = await res.json();
      setHomeData(savedData);
      toast.success(
        editingIndex !== null ? "Category updated! ✅" : "Category added! ✅",
        {
          duration: 3000,
          style: {
            background: "#14321e",
            color: "#4ade80",
            border: "1px solid #4ade80",
            fontWeight: "600",
          },
          icon: "🎉",
        }
      );
      closeModal();
    } catch (error) {
      toast.error("Failed to save category", {
        duration: 3000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  // ===== DELETE (with custom toaster confirmation) =====
  const handleDelete = (index) => {
    const cat = categories[index];

    toast(
      (t) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "280px",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "14px" }}>
            Delete this category?
          </span>
          <span style={{ fontSize: "12px", color: "#999" }}>
            <strong style={{ color: "#e0983f" }}>{cat.name}</strong> will be
            permanently removed from the website.
          </span>
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "6px 14px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const updatedCategories = categories.filter(
                    (_, i) => i !== index
                  );

                  const res = await fetch(
                    `${API_URL}/home-category/${homeData._id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ categories: updatedCategories }),
                    }
                  );

                  if (!res.ok) throw new Error("Failed to delete");

                  const savedData = await res.json();
                  setHomeData(savedData);

                  toast.success("Category deleted! 🗑️", {
                    duration: 3000,
                    style: {
                      background: "#14321e",
                      color: "#4ade80",
                      border: "1px solid #4ade80",
                      fontWeight: "600",
                    },
                    icon: "🎉",
                  });
                } catch (error) {
                  toast.error("Failed to delete", {
                    duration: 3000,
                    style: {
                      background: "#3a1a1a",
                      color: "#ff6b6b",
                      border: "1px solid #ff6b6b",
                      fontWeight: "600",
                    },
                  });
                }
              }}
              style={{
                padding: "6px 14px",
                background: "#e5484d",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        style: {
          background: "#17171c",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
          padding: "16px",
          maxWidth: "360px",
        },
      }
    );
  };

  // ===== UPDATE TITLE / SUBTITLE =====
  const handleHeaderUpdate = async (field, value) => {
    setHomeData((prev) => ({ ...prev, [field]: value }));
    try {
      await fetch(`${API_URL}/home-category/${homeData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (error) {
      console.error("Failed to update header");
    }
  };

  const showingFrom = categories.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, categories.length);

  return (
    <div className="categories-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="categories-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="categories-content">
          {/* Header */}
          <div className="cat-header">
            <div>
              <h1 className="cat-title">Shop By Category</h1>
              <div className="cat-breadcrumb">
                <span>Dashboard</span>
                <span className="cat-breadcrumb-sep">›</span>
                <span className="cat-breadcrumb-current">Home Category</span>
              </div>
            </div>
            <button className="cat-btn-primary" onClick={handleAddNew}>
              <Plus size={16} strokeWidth={2.5} />
              Add New Category
            </button>
          </div>

          {/* Title & Subtitle Edit */}
          {homeData && (
            <div className="cat-section-header">
              <div className="cat-form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={homeData.title || ""}
                  onChange={(e) => handleHeaderUpdate("title", e.target.value)}
                  placeholder="e.g. SHOP BY CATEGORY"
                />
              </div>
              <div className="cat-form-group">
                <label>Section Subtitle</label>
                <input
                  type="text"
                  value={homeData.subtitle || ""}
                  onChange={(e) => handleHeaderUpdate("subtitle", e.target.value)}
                  placeholder="e.g. COLLECTIONS"
                />
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="cat-stats-grid">
            <div className="cat-stat-card">
              <div className="cat-stat-icon cat-stat-icon-orange">
                <Folder size={20} />
              </div>
              <div>
                <div className="cat-stat-label">Total Categories</div>
                <div className="cat-stat-value">{totalCategories}</div>
                <div className="cat-stat-sub">All Categories</div>
              </div>
            </div>

            <div className="cat-stat-card">
              <div className="cat-stat-icon cat-stat-icon-green">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="cat-stat-label">Active Categories</div>
                <div className="cat-stat-value">{activeCount}</div>
                <div className="cat-stat-sub">Showing on Website</div>
              </div>
            </div>

            <div className="cat-stat-card">
              <div className="cat-stat-icon cat-stat-icon-orange">
                <EyeOff size={20} />
              </div>
              <div>
                <div className="cat-stat-label">Inactive Categories</div>
                <div className="cat-stat-value">{inactiveCount}</div>
                <div className="cat-stat-sub">Hidden from Website</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="cat-table-wrapper">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Category Name</th>
                  <th>Button Text</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>
                      Loading...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="cat-empty">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((cat, idx) => (
                    <tr key={idx}>
                      <td>{(page - 1) * perPage + idx + 1}</td>
                      <td>
                        <img
                          src={getImageUrl(cat.image)}
                          alt={cat.name}
                          className="cat-thumb"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/60x60/2a2a2a/f5a623?text=?";
                          }}
                        />
                      </td>
                      <td>
                        <div className="cat-name">{cat.name}</div>
                      </td>
                      <td>
                        <div className="cat-desc">{cat.buttonText || "SHOP NOW"}</div>
                      </td>
                      <td>
                        <div className="cat-desc">{cat.order}</div>
                      </td>
                      <td>
                        <div className="cat-actions">
                          <button
                            className="cat-action-btn cat-edit-btn"
                            onClick={() => handleEdit((page - 1) * perPage + idx)}
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="cat-action-btn cat-delete-btn"
                            onClick={() => handleDelete((page - 1) * perPage + idx)}
                            aria-label="Delete"
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

            {/* Footer */}
            <div className="cat-table-footer">
              <div className="cat-showing">
                Showing {showingFrom} to {showingTo} of {categories.length} categories
              </div>
              <div className="cat-pagination">
                <select
                  className="cat-per-page"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {PER_PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} per page
                    </option>
                  ))}
                </select>

                <button
                  className="cat-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={
                      p === page
                        ? "cat-page-num cat-page-num-active"
                        : "cat-page-num"
                    }
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  className="cat-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="cat-modal-overlay" onClick={closeModal}>
          <div className="cat-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cat-modal-header">
              <h2>{editingIndex !== null ? "Edit Category" : "Add New Category"}</h2>
              <button className="cat-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="cat-modal-body">
              <div className="cat-form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Utensils"
                />
              </div>

              <div className="cat-form-group">
                <label>Image *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                {!form.image ? (
                  <button
                    type="button"
                    className="cat-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload size={16} />
                    {uploading ? "Uploading..." : "Choose Image from Computer"}
                  </button>
                ) : (
                  <div className="cat-upload-preview-wrapper">
                    <div className="cat-image-preview">
                      <img
                        src={getImageUrl(form.image)}
                        alt="Preview"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/200x150/2a2a2a/f5a623?text=?";
                        }}
                      />
                    </div>
                    <div className="cat-upload-actions">
                      <button
                        type="button"
                        className="cat-change-img-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <ImageIcon size={14} />
                        {uploading ? "Uploading..." : "Change Image"}
                      </button>
                      <button
                        type="button"
                        className="cat-remove-img-btn"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, image: "" }))
                        }
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="cat-form-row">
                <div className="cat-form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleChange}
                    placeholder="SHOP NOW"
                  />
                </div>
                <div className="cat-form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="cat-modal-footer">
              <button className="cat-cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="cat-save-btn"
                onClick={handleSave}
                disabled={saving || uploading}
              >
                <Save size={16} /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}