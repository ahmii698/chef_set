// src/admin/pages/SubscribeUs.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Bell, RefreshCw, Trash2, Mail, Users
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getAllSubscribers,
  deleteSubscriber
} from "../services/adminNewsletterService";
import "./SubscribeUs.css";

const ITEMS_PER_PAGE = 10;

const SubscribeUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ===== FETCH SUBSCRIBERS =====
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscribers();
      setSubscribers(data.subscribers || []);
      setStats(data.stats || { totalSubscribers: 0, activeSubscribers: 0 });
    } catch (error) {
      toast.error("Failed to fetch subscribers", {
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
    fetchSubscribers();
  }, []);

  // ===== FILTER =====
  const filtered = useMemo(() => {
    return subscribers.filter((s) =>
      s.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [subscribers, search]);

  // ===== PAGINATION =====
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ===== DELETE (with custom toaster confirmation) =====
  const handleDelete = (sub) => {
    toast(
      (t) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "260px",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "14px" }}>
            Remove this subscriber?
          </span>
          <span style={{ fontSize: "12px", color: "#999" }}>
            <strong style={{ color: "#e0983f" }}>{sub.email}</strong> will be
            removed from the newsletter list.
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
                  await deleteSubscriber(sub._id);
                  toast.success("Subscriber removed! 🗑️", {
                    duration: 3000,
                    style: {
                      background: "#14321e",
                      color: "#4ade80",
                      border: "1px solid #4ade80",
                      fontWeight: "600",
                    },
                    icon: "🎉",
                  });
                  setSubscribers((prev) =>
                    prev.filter((x) => x._id !== sub._id)
                  );
                  fetchSubscribers();
                } catch (error) {
                  toast.error(error.message || "Failed to delete", {
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
              Remove
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
          maxWidth: "340px",
        },
      }
    );
  };

  return (
    <div className="subscribeus-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="subscribeus-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="subscribeus-content">
          {/* Header */}
          <div className="subscribeus-header">
            <div>
              <h1 className="subscribeus-title">Newsletter Subscribers</h1>
              <div className="subscribeus-breadcrumb">
                <span>Dashboard</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-active">Subscribe Us</span>
              </div>
            </div>
          </div>

          {/* Stats - 2 Cards Full Width */}
          <div className="subscribeus-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Bell size={22} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Subscribers</p>
                <h2 className="stat-value">{stats.totalSubscribers}</h2>
                <p className="stat-sub">All Time Subscribers</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users size={22} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Active Subscribers</p>
                <h2 className="stat-value">{stats.activeSubscribers}</h2>
                <p className="stat-sub">Receiving Newsletter</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="table-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <button className="btn-filter" onClick={fetchSubscribers}>
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="subscribeus-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Subscribed Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      Loading subscribers...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", padding: "30px" }}
                    >
                      No subscribers found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((s, index) => (
                    <tr key={s._id}>
                      <td>{startIdx + index + 1}</td>
                      <td className="email-cell">
                        <Mail
                          size={14}
                          style={{ marginRight: "6px", verticalAlign: "middle" }}
                        />
                        {s.email}
                      </td>
                      <td className="date-cell">
                        {new Date(
                          s.subscribedAt || s.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            s.isActive ? "active" : "inactive"
                          }`}
                        >
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            className="icon-btn delete"
                            onClick={() => handleDelete(s)}
                            title="Remove"
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
              {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of{" "}
              {filtered.length} subscribers
            </p>
            <div className="pagination-controls">
              <button
                type="button"
                className="page-btn"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (num) =>
                    num === 1 ||
                    num === totalPages ||
                    Math.abs(num - safePage) <= 1
                )
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeUs;