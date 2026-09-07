// src/admin/pages/FAQ.jsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  HelpCircle,
  CheckCircle,
  EyeOff,
  LayoutGrid,
  GripVertical,
  Move,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Faq.css";

const faqData = [
  {
    id: 1,
    question: "What is Chefset?",
    answer:
      "Chefset is a premium kitchen equipment brand trusted by professional chefs and cooking enthusiasts worldwide. We offer...",
    status: "Active",
    order: 1,
  },
  {
    id: 2,
    question: "Are Chefset products suitable for professional use?",
    answer:
      "Yes, absolutely! Chefset products are designed with professional chefs in mind. They are built to withstand high usage...",
    status: "Active",
    order: 2,
  },
  {
    id: 3,
    question: "What materials are used in Chefset products?",
    answer:
      "We use high-quality stainless steel, cast iron, and other premium materials to ensure durability, safety, and long-lasting...",
    status: "Active",
    order: 3,
  },
  {
    id: 4,
    question: "How do I care for my Chefset products?",
    answer:
      "To keep your Chefset products in top condition, we recommend hand washing with mild soap, drying immediately...",
    status: "Active",
    order: 4,
  },
  {
    id: 5,
    question: "Do Chefset products come with a warranty?",
    answer:
      "Yes, all Chefset products come with a limited warranty against manufacturing defects. Warranty periods vary by product...",
    status: "Active",
    order: 5,
  },
  {
    id: 6,
    question: "How long does shipping take?",
    answer:
      "Shipping times depend on your location. Orders are typically processed within 1-2 business days and delivered within...",
    status: "Inactive",
    order: 6,
  },
];

const FAQ = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [faqs, setFaqs] = useState(faqData);
  const [search, setSearch] = useState("");

  const toggleStatus = (id) => {
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === "Active" ? "Inactive" : "Active" }
          : f
      )
    );
  };

  const updateOrder = (id, value) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, order: Number(value) } : f))
    );
  };

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

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
            <button className="btn-primary">
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
                <h2 className="stat-value">18</h2>
                <p className="stat-sub">All Questions</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="stat-label">Active FAQs</p>
                <h2 className="stat-value">14</h2>
                <p className="stat-sub green">Visible on Website</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <EyeOff size={20} />
              </div>
              <div>
                <p className="stat-label">Inactive FAQs</p>
                <h2 className="stat-value">4</h2>
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
                <p className="stat-sub">Drag to Reorder</p>
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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="select-input">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <button className="btn-filter">
              <Filter size={14} />
              Filter
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
                {filtered.map((f, index) => (
                  <tr key={f.id}>
                    <td>
                      <div className="drag-cell">
                        <GripVertical size={16} className="drag-handle" />
                        {index + 1}
                      </div>
                    </td>
                    <td className="question-cell">{f.question}</td>
                    <td className="answer-cell">{f.answer}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={f.status === "Active"}
                          onChange={() => toggleStatus(f.id)}
                        />
                        <span className="slider" />
                      </label>
                      <span
                        className={`status-text ${
                          f.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="order-input"
                        value={f.order}
                        onChange={(e) =>
                          updateOrder(f.id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit">
                          <Edit size={15} />
                        </button>
                        <button className="icon-btn delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-row">
            <p>Showing 1 to 6 of 18 FAQs</p>
            <div className="pagination-controls">
              <select className="select-input small">
                <option>10 per page</option>
                <option>20 per page</option>
                <option>50 per page</option>
              </select>
              <button className="page-btn">‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;