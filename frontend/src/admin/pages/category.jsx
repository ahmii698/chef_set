// src/admin/pages/CategoryPage.jsx
import React, { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Folder, CheckCircle2, EyeOff, Grid3x3, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./category.css";

// Dummy initial data — replace with API data as needed
const initialCategories = [
  {
    id: 1,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=K",
    name: "Kitchen Knives",
    description: "Premium quality kitchen knives",
    order: 1,
    active: true,
    createdAt: "May 25, 2025",
    createdTime: "10:30 AM",
  },
  {
    id: 2,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=C",
    name: "Cookware",
    description: "Pots, pans and cooking sets",
    order: 2,
    active: true,
    createdAt: "May 25, 2025",
    createdTime: "10:35 AM",
  },
  {
    id: 3,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=U",
    name: "Kitchen Utensils",
    description: "Essential cooking tools",
    order: 3,
    active: true,
    createdAt: "May 25, 2025",
    createdTime: "10:40 AM",
  },
  {
    id: 4,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=A",
    name: "Kitchen Appliances",
    description: "Modern kitchen appliances",
    order: 4,
    active: false,
    createdAt: "May 25, 2025",
    createdTime: "10:42 AM",
  },
  {
    id: 5,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=B",
    name: "Bakeware",
    description: "Baking trays and accessories",
    order: 5,
    active: true,
    createdAt: "May 25, 2025",
    createdTime: "10:45 AM",
  },
  {
    id: 6,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=S",
    name: "Storage & Organization",
    description: "Kitchen storage solutions",
    order: 6,
    active: false,
    createdAt: "May 25, 2025",
    createdTime: "10:50 AM",
  },
  {
    id: 7,
    image: "https://placehold.co/60x60/2a2a2a/f5a623?text=Cu",
    name: "Cutlery",
    description: "Spoons, forks and more",
    order: 7,
    active: true,
    createdAt: "May 25, 2025",
    createdTime: "10:55 AM",
  },
];

const PER_PAGE_OPTIONS = [10, 20, 50];

export default function CategoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ← Sidebar state add karo
  const [categories, setCategories] = useState(initialCategories);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [draggedId, setDraggedId] = useState(null);

  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.active).length;
  const inactiveCount = categories.filter((c) => !c.active).length;

  const totalPages = Math.max(1, Math.ceil(categories.length / perPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return categories.slice(start, start + perPage);
  }, [categories, page, perPage]);

  const toggleActive = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEdit = (id) => {
    console.log("Edit category:", id);
  };

  const handleAddNew = () => {
    console.log("Add new category clicked");
  };

  const handleDragStart = (id) => setDraggedId(id);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (targetId) => {
    if (draggedId === null || draggedId === targetId) return;
    setCategories((prev) => {
      const list = [...prev];
      const fromIndex = list.findIndex((c) => c.id === draggedId);
      const toIndex = list.findIndex((c) => c.id === targetId);
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return list.map((c, idx) => ({ ...c, order: idx + 1 }));
    });
    setDraggedId(null);
  };

  const showingFrom = categories.length === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, categories.length);

  return (
    // ✅ SAHI - Products page ki tarah layout
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
              <h1 className="cat-title">Categories</h1>
              <div className="cat-breadcrumb">
                <span>Dashboard</span>
                <span className="cat-breadcrumb-sep">›</span>
                <span className="cat-breadcrumb-current">Categories</span>
              </div>
            </div>
            <button className="cat-btn-primary" onClick={handleAddNew}>
              <Plus size={16} strokeWidth={2.5} />
              Add New Category
            </button>
          </div>

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

            <div className="cat-stat-card">
              <div className="cat-stat-icon cat-stat-icon-orange">
                <Grid3x3 size={20} />
              </div>
              <div>
                <div className="cat-stat-label">Display Order</div>
                <div className="cat-stat-value cat-stat-value-sm">Drag &amp; Drop</div>
                <div className="cat-stat-sub">Sort Categories Easily</div>
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
                  <th>Display Order</th>
                  <th>Status (Home)</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    draggable
                    onDragStart={() => handleDragStart(cat.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(cat.id)}
                    className={draggedId === cat.id ? "cat-row-dragging" : ""}
                  >
                    <td>{(page - 1) * perPage + idx + 1}</td>
                    <td>
                      <img src={cat.image} alt={cat.name} className="cat-thumb" />
                    </td>
                    <td>
                      <div className="cat-name">{cat.name}</div>
                      <div className="cat-desc">{cat.description}</div>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="cat-order-input"
                        value={cat.order}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCategories((prev) =>
                            prev.map((c) =>
                              c.id === cat.id ? { ...c, order: val } : c
                            )
                          );
                        }}
                      />
                    </td>
                    <td>
                      <label className="cat-switch">
                        <input
                          type="checkbox"
                          checked={cat.active}
                          onChange={() => toggleActive(cat.id)}
                        />
                        <span className="cat-slider" />
                      </label>
                      <span
                        className={
                          cat.active ? "cat-status-active" : "cat-status-inactive"
                        }
                      >
                        {cat.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="cat-date">{cat.createdAt}</div>
                      <div className="cat-time">{cat.createdTime}</div>
                    </td>
                    <td>
                      <div className="cat-actions">
                        <button
                          className="cat-action-btn cat-edit-btn"
                          onClick={() => handleEdit(cat.id)}
                          aria-label="Edit category"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="cat-action-btn cat-delete-btn"
                          onClick={() => handleDelete(cat.id)}
                          aria-label="Delete category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="cat-empty">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Footer / Pagination */}
            <div className="cat-table-footer">
              <div className="cat-showing">
                Showing {showingFrom} to {showingTo} of {categories.length}{" "}
                categories
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
                      p === page ? "cat-page-num cat-page-num-active" : "cat-page-num"
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
    </div>
  );
}