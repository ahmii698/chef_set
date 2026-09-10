// src/admin/pages/Products.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Bold, Italic, Underline, List as ListIcon,
  ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Plus, X, Pencil, Trash2, Search, Star, ChevronDown,
  ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getAdminToken } from "../services/adminAuthService";
import { API_URL, STORAGE_URL } from "../../../config";
import "./Products.css";

const CATEGORIES = ["Cookware", "Knives", "Utensils", "Accessories", "Bakeware", "Storage", "Bowls"];

const emptyForm = {
  name: "",
  category: "",
  shortDesc: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "",
  status: "Active",
  featured: false,
  images: [], // { id, url, file?, isExisting? }
  mainImageId: null,
};

const ITEMS_PER_PAGE = 8;

const ProductsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);
  const listRef = useRef(null);

  // ===== FETCH PRODUCTS =====
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      const response = await fetch(`${API_URL}/admin-products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===== FORM FIELD HANDLERS =====
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleFeatured = () => {
    setForm((prev) => ({ ...prev, featured: !prev.featured }));
  };

  // ===== IMAGE HANDLERS =====
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setForm((prev) => {
      const images = [...prev.images, ...newImages];
      const mainImageId = prev.mainImageId || images[0]?.id || null;
      return { ...prev, images, mainImageId };
    });

    e.target.value = "";
  };

  const removeImage = (id) => {
    setForm((prev) => {
      const images = prev.images.filter((img) => img.id !== id);
      let mainImageId = prev.mainImageId;
      if (mainImageId === id) {
        mainImageId = images[0]?.id || null;
      }
      return { ...prev, images, mainImageId };
    });
  };

  const setMainImage = (id) => {
    setForm((prev) => ({ ...prev, mainImageId: id }));
  };

  const mainImage = form.images.find((img) => img.id === form.mainImageId) || null;

  // ===== SUBMIT FORM =====
  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price || !form.stock) {
      alert("Please fill all required fields (Name, Category, Price, Stock)");
      return;
    }

    setSaving(true);

    try {
      const token = getAdminToken();
      const formData = new FormData();

      // Add text fields
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('price', form.price);
      if (form.salePrice) formData.append('salePrice', form.salePrice);
      formData.append('stock', form.stock);
      formData.append('status', form.status);
      formData.append('shortDesc', form.shortDesc);
      formData.append('description', form.description);
      formData.append('featured', form.featured);

      // Handle images
      const existingImages = [];
      let mainIndex = 0;

      form.images.forEach((img, idx) => {
        if (img.file) {
          formData.append('images', img.file);
        } else {
          // Existing image (filename)
          existingImages.push(img.url);
        }
        if (img.id === form.mainImageId) {
          mainIndex = idx;
        }
      });

      formData.append('existingImages', JSON.stringify(existingImages));
      formData.append('mainImageIndex', mainIndex);

      const url = editingId 
        ? `${API_URL}/admin-products/${editingId}` 
        : `${API_URL}/admin-products`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Product saved successfully!');
        resetForm();
        fetchProducts();
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  // ===== EDIT =====
  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      shortDesc: product.shortDesc || "",
      description: product.description || "",
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      stock: String(product.stock),
      status: product.status || "Active",
      featured: product.featured || false,
      images: (product.images || [product.image]).filter(Boolean).map((img, idx) => ({
        id: `existing-${idx}`,
        url: img,
        isExisting: true
      })),
      mainImageId: (product.images || [product.image]).findIndex(i => i === product.image) >= 0 
        ? `existing-${(product.images || [product.image]).findIndex(i => i === product.image)}`
        : `existing-0`,
    });
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = getAdminToken();
      const response = await fetch(`${API_URL}/admin-products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete product');
    }
  };

  // ===== VIEW LIVE =====
  const handleViewLive = (productId) => {
    window.open(`/product/${productId}`, '_blank');
  };

  // ===== FILTERING + PAGINATION =====
  const filteredProducts = products.filter((p) => {
    const matchCategory = filterCategory === "All Categories" || p.category === filterCategory;
    const matchStatus = filterStatus === "All Status" || p.status === filterStatus;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="products-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="products-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="products-content">
          {/* Top bar */}
          <div className="products-topbar" ref={formTopRef}>
            <div className="topbar-left">
              <button className="back-btn" type="button" onClick={handleCancel}>
                <ArrowLeft size={18} />
              </button>
              <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
            </div>
            <button
              className="view-products-btn"
              type="button"
              onClick={() => listRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              View Products
            </button>
          </div>

          {/* Form grid */}
          <div className="product-form-grid">
            {/* Left: Basic info + images */}
            <div className="form-card">
              <h3 className="card-title">Basic Information</h3>

              <div className="form-row two-col">
                <div className="form-field">
                  <label>Product Name <span className="req">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className="form-field">
                  <label>Category <span className="req">*</span></label>
                  <div className="select-wrapper">
                    <select name="category" value={form.category} onChange={handleFieldChange}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="select-icon" size={16} />
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label>Short Description</label>
                <div className="input-with-counter">
                  <input
                    type="text"
                    name="shortDesc"
                    placeholder="Enter short description (Max 160 characters)"
                    maxLength={160}
                    value={form.shortDesc}
                    onChange={handleFieldChange}
                  />
                  <span className="char-count">{form.shortDesc.length}/160</span>
                </div>
              </div>

              <div className="form-field">
                <label>Description</label>
                <div className="editor-box">
                  <textarea
                    name="description"
                    placeholder="Enter product description..."
                    rows={5}
                    value={form.description}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="product-images-section">
                <div className="section-header-row">
                  <div>
                    <h3 className="card-title">Product Images</h3>
                    <p className="section-sub">Upload multiple images (max 5MB each)</p>
                  </div>
                </div>

                <div className="images-grid">
                  {form.images.map((img) => (
                    <div
                      key={img.id}
                      className={`image-thumb ${img.id === form.mainImageId ? "is-main" : ""}`}
                      onClick={() => setMainImage(img.id)}
                    >
                      {img.id === form.mainImageId && <span className="main-badge">Main</span>}
                      <img 
                        src={img.isExisting ? `${STORAGE_URL}/${img.url}` : img.url} 
                        alt="product" 
                      />
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <label className="add-image-box">
                    <Plus size={20} />
                    <span>Add More Images</span>
                    <small>JPG, PNG up to 5MB</small>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                <p className="images-hint">
                  Click an image to set it as Main. First image is main by default.
                </p>
              </div>
            </div>

            {/* Right: Pricing + Publishing */}
            <div className="form-card">
              <h3 className="card-title">Pricing &amp; Inventory</h3>

              <div className="form-row two-col">
                <div className="form-field">
                  <label>Price (PKR) <span className="req">*</span></label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter product price"
                    value={form.price}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className="form-field">
                  <label>Sale Price (PKR)</label>
                  <input
                    type="number"
                    name="salePrice"
                    placeholder="Optional"
                    value={form.salePrice}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Stock <span className="req">*</span></label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Enter stock quantity"
                  value={form.stock}
                  onChange={handleFieldChange}
                />
              </div>

              <div className="form-field">
                <label>Status</label>
                <div className="select-wrapper">
                  <select name="status" value={form.status} onChange={handleFieldChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="select-icon" size={16} />
                </div>
              </div>

              <div className="publishing-section">
                <h3 className="card-title">Publishing</h3>

                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">Featured Product</p>
                    <p className="toggle-sub">Show on homepage</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={handleToggleFeatured}
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="main-display-row">
                  <div>
                    <p className="toggle-label">Main Display Image</p>
                    <p className="toggle-sub">Shown on product card</p>
                  </div>
                  <div className="main-display-preview">
                    {mainImage ? (
                      <img 
                        src={mainImage.isExisting ? `${STORAGE_URL}/${mainImage.url}` : mainImage.url} 
                        alt="main" 
                      />
                    ) : (
                      <span className="no-image">No image</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="save-btn" 
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </div>
          </div>

          {/* Products list */}
          <div className="products-list-section" ref={listRef}>
            <div className="list-header">
              <div>
                <h2>Products</h2>
                <p>Manage all your products from here.</p>
              </div>
              <button type="button" className="add-new-btn" onClick={handleCancel}>
                <Plus size={16} /> Add New Product
              </button>
            </div>

            <div className="list-filters">
              <div className="select-wrapper filter-select">
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option>All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>

              <div className="select-wrapper filter-select">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>

              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Sale Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="empty-row">Loading...</td>
                    </tr>
                  ) : paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="empty-row">No products found.</td>
                    </tr>
                  ) : (
                    paginatedProducts.map((p, idx) => (
                      <tr key={p._id}>
                        <td>{startIdx + idx + 1}</td>
                        <td>
                          <div className="table-thumb">
                            {p.image && <img src={`${STORAGE_URL}/${p.image}`} alt={p.name} />}
                          </div>
                        </td>
                        <td>
                          <div className="product-name-cell">
                            <span className="pname">{p.name}</span>
                            <span className="pdesc">{p.shortDesc}</span>
                          </div>
                        </td>
                        <td>{p.category}</td>
                        <td>PKR {p.price.toLocaleString()}</td>
                        <td>
                          {p.salePrice ? (
                            <span className="sale-price">PKR {p.salePrice.toLocaleString()}</span>
                          ) : "—"}
                        </td>
                        <td>{p.stock}</td>
                        <td>
                          <span className={`status-pill ${p.status === "Active" ? "active" : "inactive"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <Star
                            size={16}
                            className={p.featured ? "star-filled" : "star-empty"}
                            fill={p.featured ? "#e0983f" : "none"}
                          />
                        </td>
                        <td className="action-cell">
                          <button
                            type="button"
                            className="icon-btn view"
                            onClick={() => handleViewLive(p._id)}
                            title="View on Live"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn edit"
                            onClick={() => handleEdit(p)}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn delete"
                            onClick={() => handleDelete(p._id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <span>
                Showing {filteredProducts.length === 0 ? 0 : startIdx + 1} to{" "}
                {Math.min(startIdx + ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
                {filteredProducts.length} products
              </span>
              <div className="pagination-controls">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={num === safePage ? "active-page" : ""}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;