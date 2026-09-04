// src/admin/pages/Testimonials.jsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Star,
  Edit,
  Eye,
  Trash2,
  MessageSquare,
  CheckCircle,
  EyeOff,
  Monitor,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./testimonials.css";

const testimonialsData = [
  {
    id: 1,
    name: "Chef Michael Rodriguez",
    role: "Executive Chef, Madrid",
    profession: "Executive Chef",
    rating: 5,
    status: "Active",
    date: "May 25, 2025",
    time: "10:30 AM",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Restaurant Owner",
    profession: "Restaurant Owner",
    rating: 5,
    status: "Active",
    date: "May 24, 2025",
    time: "09:15 AM",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Chef David Thompson",
    role: "Culinary Instructor",
    profession: "Culinary Instructor",
    rating: 5,
    status: "Active",
    date: "May 23, 2025",
    time: "08:45 AM",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Hotel Manager",
    profession: "Hotel Manager",
    rating: 4,
    status: "Inactive",
    date: "May 22, 2025",
    time: "02:20 PM",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 5,
    name: "Emma Davis",
    role: "Food Blogger",
    profession: "Food Blogger",
    rating: 5,
    status: "Active",
    date: "May 20, 2025",
    time: "11:10 AM",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 6,
    name: "Alex Johnson",
    role: "Private Chef",
    profession: "Private Chef",
    rating: 4,
    status: "Inactive",
    date: "May 18, 2025",
    time: "04:30 PM",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
  },
];

const Stars = ({ count }) => (
  <div className="stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? "star filled" : "star"}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const filtered = testimonialsData.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.profession.toLowerCase().includes(search.toLowerCase())
  );

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
            <button className="btn-primary">
              <Plus size={16} />
              Add New Testimonial
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="stat-label">Total Testimonials</p>
                <h2 className="stat-value">12</h2>
                <p className="stat-sub">All Testimonials</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="stat-label">Active Testimonials</p>
                <h2 className="stat-value">8</h2>
                <p className="stat-sub green">Showing on Website</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <EyeOff size={20} />
              </div>
              <div>
                <p className="stat-label">Inactive Testimonials</p>
                <h2 className="stat-value">4</h2>
                <p className="stat-sub red">Hidden from Website</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Monitor size={20} />
              </div>
              <div>
                <p className="stat-label">Display Settings</p>
                <h2 className="stat-value">Auto Rotate</h2>
                <p className="stat-sub">Visible on Homepage Slider</p>
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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="select-input">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <select className="select-input">
              <option>Sort by: Latest</option>
              <option>Sort by: Oldest</option>
              <option>Sort by: Rating</option>
            </select>

            <button className="btn-filter">
              <Filter size={14} />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="testimonials-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Profession</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, index) => (
                  <tr key={t.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(t.id)}
                        onChange={() => toggleRow(t.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>
                      <div className="customer-cell">
                        <img src={t.avatar} alt={t.name} />
                        <div>
                          <p className="customer-name">{t.name}</p>
                          <p className="customer-role">{t.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="profession-cell">{t.profession}</td>
                    <td>
                      <Stars count={t.rating} />
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          t.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <p className="date-cell">{t.date}</p>
                      <p className="time-cell">{t.time}</p>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn edit">
                          <Edit size={15} />
                        </button>
                        <button className="icon-btn view">
                          <Eye size={15} />
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
            <p>Showing 1 to 6 of 12 testimonials</p>
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

export default Testimonials;