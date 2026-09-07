import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List as ListIcon,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Products.css";

const CATEGORIES = ["Cookware", "Knives", "Utensils", "Accessories", "Bakeware"];

const initialProducts = [
  {
    id: 1,
    name: "Stainless Steel Cookware Set",
    shortDesc: "Premium quality cookware set",
    description: "",
    category: "Cookware",
    price: 12500,
    salePrice: 9999,
    stock: 24,
    sku: "",
    status: "Active",
    featured: true,
    date: "May 30, 2025",
    image: null,
  },
  {
    id: 2,
    name: "Chef Knife Set 6PCS",
    shortDesc: "High quality stainless steel knives",
    description: "",
    category: "Knives",
    price: 6800,
    salePrice: 5499,
    stock: 42,
    sku: "",
    status: "Active",
    featured: true,
    date: "May 29, 2025",
    image: null,
  },
  {
    id: 3,
    name: "Non-Stick Frying Pan",
    shortDesc: "Durable non-stick frying pan",
    description: "",
    category: "Cookware",
    price: 3200,
    salePrice: null,
    stock: 68,
    sku: "",
    status: "Active",
    featured: false,
    date: "May 28, 2025",
    image: null,
  },
  {
    id: 4,
    name: "Silicone Kitchen Utensils Set",
    shortDesc: "Heat resistant silicone utensils",
    description: "",
    category: "Utensils",
    price: 2450,
    salePrice: null,
    stock: 55,
    sku: "",
    status: "Inactive",
    featured: false,
    date: "May 26, 2025",
    image: null,
  },
  {
    id: 5,
    name: "Wooden Cutting Board",
    shortDesc: "Premium wooden cutting board",
    description: "",
    category: "Accessories",
    price: 1750,
    salePrice: null,
    stock: 35,
    sku: "",
    status: "Active",
    featured: false,
    date: "May 25, 2025",
    image: null,
  },
];

const emptyForm = {
  name: "",
  category: "",
  shortDesc: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "",
  sku: "",
  status: "Active",
  featured: false,
  images: [], // { id, url }
  mainImageId: null,
};

const ITEMS_PER_PAGE = 5;

const ProductsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);
  const listRef = useRef(null);

  // ---------- Form field handlers ----------
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleFeatured = () => {
    setForm((prev) => ({ ...prev, featured: !prev.featured }));
  };

  // ---------- Image handlers ----------
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

  // ---------- Form submit / edit / cancel ----------
  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.price || !form.stock) {
      alert("Please fill all required fields (Product Name, Category, Price, Stock)");
      return;
    }

    const mainUrl = mainImage ? mainImage.url : null;
    const todayLabel = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (editingId) {
      // TODO: API call — update product on backend
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: form.name,
                shortDesc: form.shortDesc,
                description: form.description,
                category: form.category,
                price: Number(form.price),
                salePrice: form.salePrice ? Number(form.salePrice) : null,
                stock: Number(form.stock),
                sku: form.sku,
                status: form.status,
                featured: form.featured,
                image: mainUrl,
              }
            : p
        )
      );
    } else {
      // TODO: API call — create product on backend
      const newProduct = {
        id: Date.now(),
        name: form.name,
        shortDesc: form.shortDesc,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stock: Number(form.stock),
        sku: form.sku,
        status: form.status,
        featured: form.featured,
        date: todayLabel,
        image: mainUrl,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }

    resetForm();
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      shortDesc: product.shortDesc,
      description: product.description || "",
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      stock: String(product.stock),
      sku: product.sku || "",
      status: product.status,
      featured: product.featured,
      images: product.image
        ? [{ id: "existing-main", url: product.image }]
        : [],
      mainImageId: product.image ? "existing-main" : null,
    });
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    // TODO: API call — delete product on backend
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ---------- Filtering + pagination ----------
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      filterCategory === "All Categories" || p.category === filterCategory;
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
              <button className="back-btn" type="button">
                <ArrowLeft size={18} />
              </button>
              <h2>{editingId ? "Edit Product" : "Add / Edit Product"}</h2>
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
                  <label>
                    Product Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className="form-field">
                  <label>
                    Category <span className="req">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select name="category" value={form.category} onChange={handleFieldChange}>
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
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
                  <div className="editor-toolbar">
                    <div className="select-wrapper editor-format">
                      <select defaultValue="Normal">
                        <option>Normal</option>
                        <option>Heading</option>
                        <option>Subheading</option>
                      </select>
                      <ChevronDown className="select-icon" size={14} />
                    </div>
                    <span className="toolbar-divider" />
                    <button type="button" className="toolbar-btn">
                      <Bold size={14} />
                    </button>
                    <button type="button" className="toolbar-btn">
                      <Italic size={14} />
                    </button>
                    <button type="button" className="toolbar-btn">
                      <Underline size={14} />
                    </button>
                    <span className="toolbar-divider" />
                    <button type="button" className="toolbar-btn">
                      <ListIcon size={14} />
                    </button>
                    <button type="button" className="toolbar-btn">
                      <ListOrdered size={14} />
                    </button>
                    <span className="toolbar-divider" />
                    <button type="button" className="toolbar-btn">
                      <LinkIcon size={14} />
                    </button>
                    <button type="button" className="toolbar-btn">
                      <ImageIcon size={14} />
                    </button>
                  </div>
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
                    <p className="section-sub">Upload multiple images for this product</p>
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
                      <img src={img.url} alt="product" />
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
                  Click an image to set it as Main. First image is set as main by default.
                </p>
              </div>
            </div>

            {/* Right: Pricing + Publishing */}
            <div className="form-card">
              <h3 className="card-title">Pricing &amp; Inventory</h3>

              <div className="form-row two-col">
                <div className="form-field">
                  <label>
                    Price (PKR) <span className="req">*</span>
                  </label>
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
                    placeholder="Enter sale price (optional)"
                    value={form.salePrice}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-field">
                  <label>
                    Stock <span className="req">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Enter stock quantity"
                    value={form.stock}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className="form-field">
                  <label>SKU (Optional)</label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="Enter SKU code"
                    value={form.sku}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Status</label>
                <div className="select-wrapper">
                  <select name="status" value={form.status} onChange={handleFieldChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <ChevronDown className="select-icon" size={16} />
                </div>
              </div>

              <div className="publishing-section">
                <h3 className="card-title">Publishing</h3>

                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">Featured Product</p>
                    <p className="toggle-sub">Show this product on homepage / featured section</p>
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
                    <p className="toggle-sub">
                      This image will be shown on product card &amp; product page
                    </p>
                  </div>
                  <div className="main-display-preview">
                    {mainImage ? (
                      <img src={mainImage.url} alt="main" />
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
                <button type="button" className="save-btn" onClick={handleSubmit}>
                  {editingId ? "Update Product" : "Save Product"}
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
                    <option key={c} value={c}>
                      {c}
                    </option>
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
                  <option>Draft</option>
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
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 && (
                    <tr>
                      <td colSpan={11} className="empty-row">
                        No products found.
                      </td>
                    </tr>
                  )}
                  {paginatedProducts.map((p, idx) => (
                    <tr key={p.id}>
                      <td>{startIdx + idx + 1}</td>
                      <td>
                        <div className="table-thumb">
                          {p.image && <img src={p.image} alt={p.name} />}
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
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{p.stock}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            p.status === "Active" ? "active" : "inactive"
                          }`}
                        >
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
                      <td>{p.date}</td>
                      <td className="action-cell">
                        <button
                          type="button"
                          className="icon-btn edit"
                          onClick={() => handleEdit(p)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn delete"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
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