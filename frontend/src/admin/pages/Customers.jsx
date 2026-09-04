import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  Download,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./customers.css";

// ---------------- Dummy Data ----------------
const customersData = [
  {
    id: 1,
    name: "Ahmed Raza",
    email: "ahmed.raza@email.com",
    phone: "+92 300 1234567",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    orders: 12,
    totalSpent: "PKR 85,430",
    status: "Active",
    joinedAt: "May 25, 2025",
  },
  {
    id: 2,
    name: "Ali Khan",
    email: "ali.khan@email.com",
    phone: "+92 301 9876543",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    orders: 9,
    totalSpent: "PKR 62,280",
    status: "Active",
    joinedAt: "May 24, 2025",
  },
  {
    id: 3,
    name: "Hamza Ali",
    email: "hamza.ali@email.com",
    phone: "+92 302 3456789",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    orders: 8,
    totalSpent: "PKR 48,760",
    status: "Active",
    joinedAt: "May 23, 2025",
  },
  {
    id: 4,
    name: "Usman Sheikh",
    email: "usman.sheikh@email.com",
    phone: "+92 303 4567890",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    orders: 7,
    totalSpent: "PKR 36,250",
    status: "Active",
    joinedAt: "May 22, 2025",
  },
  {
    id: 5,
    name: "Sara Ahmed",
    email: "sara.ahmed@email.com",
    phone: "+92 304 5678901",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    orders: 6,
    totalSpent: "PKR 28,540",
    status: "Active",
    joinedAt: "May 21, 2025",
  },
  {
    id: 6,
    name: "Zain Iqbal",
    email: "zain.iqbal@email.com",
    phone: "+92 305 6789012",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    orders: 3,
    totalSpent: "PKR 18,670",
    status: "Inactive",
    joinedAt: "May 18, 2025",
  },
  {
    id: 7,
    name: "Maryam Fatima",
    email: "maryam.fatima@email.com",
    phone: "+92 306 7890123",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    orders: 2,
    totalSpent: "PKR 9,850",
    status: "Inactive",
    joinedAt: "May 17, 2025",
  },
  {
    id: 8,
    name: "Bilal Hussain",
    email: "bilal.hussain@email.com",
    phone: "+92 307 8901234",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    orders: 1,
    totalSpent: "PKR 4,200",
    status: "Inactive",
    joinedAt: "May 15, 2025",
  },
];

const statusOptions = ["All Status", "Active", "Inactive"];
const countryOptions = ["All Countries", "Pakistan", "UAE", "Saudi Arabia"];

const statusClassMap = {
  Active: "cust-status-active",
  Inactive: "cust-status-inactive",
};

export default function CustomerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [countryFilter, setCountryFilter] = useState("All Countries");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Summary numbers reflect the full customer base, not just this page
  const totalCustomers = 1540;
  const activeCustomers = 1208;
  const inactiveCustomers = 332;
  const totalSpent = "PKR 2,450,890";
  const totalPages = 154;

  const filteredCustomers = useMemo(() => {
    return customersData.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleView = (customer) => {
    console.log("View customer:", customer.id);
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Remove ${customer.name} from customers?`)) {
      console.log("Delete customer:", customer.id);
    }
  };

  const handleExport = () => {
    console.log("Export customers clicked");
  };

  const showingFrom = filteredCustomers.length === 0 ? 0 : 1;
  const showingTo = filteredCustomers.length;

  return (
    <div className="cust-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="cust-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="cust-content">
          {/* Header */}
          <div className="cust-header">
            <div>
              <h1 className="cust-title">Customers</h1>
              <div className="cust-breadcrumb">
                <span>Dashboard</span>
                <span className="cust-breadcrumb-sep">›</span>
                <span className="cust-breadcrumb-current">Customers</span>
              </div>
            </div>
            <button className="cust-btn-primary" onClick={handleExport}>
              <Download size={16} strokeWidth={2.5} />
              Export Customers
            </button>
          </div>

          {/* Stats Cards */}
          <div className="cust-stats-grid">
            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <Users size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Total Customers</div>
                <div className="cust-stat-value">
                  {totalCustomers.toLocaleString()}
                </div>
                <div className="cust-stat-sub cust-stat-up">
                  ↑ 12.5% from last month
                </div>
              </div>
            </div>

            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <UserCheck size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Active Customers</div>
                <div className="cust-stat-value">
                  {activeCustomers.toLocaleString()}
                </div>
                <div className="cust-stat-sub cust-stat-up">
                  ↑ 8.4% from last month
                </div>
              </div>
            </div>

            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <UserX size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Inactive Customers</div>
                <div className="cust-stat-value">
                  {inactiveCustomers.toLocaleString()}
                </div>
                <div className="cust-stat-sub cust-stat-down">
                  ↓ 3.2% from last month
                </div>
              </div>
            </div>

            <div className="cust-stat-card">
              <div className="cust-stat-icon cust-stat-icon-orange">
                <Briefcase size={20} />
              </div>
              <div>
                <div className="cust-stat-label">Total Spent</div>
                <div className="cust-stat-value">{totalSpent}</div>
                <div className="cust-stat-sub cust-stat-up">
                  ↑ 15.3% from last month
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="cust-filters">
            <div className="cust-search">
              <Search size={16} className="cust-search-icon" />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="cust-filter-select"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="cust-filter-select"
            >
              {countryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button className="cust-filter-date">
              <Calendar size={16} />
              <span>Select Date Range</span>
            </button>

            <button className="cust-filter-btn">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {/* Table */}
          <div className="cust-table-wrapper">
            <table className="cust-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th>Joined At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="cust-empty">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c, idx) => (
                    <tr key={c.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <div className="cust-customer-cell">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="cust-avatar"
                          />
                          <span className="cust-name">{c.name}</span>
                        </div>
                      </td>
                      <td className="cust-muted">{c.email}</td>
                      <td className="cust-muted">{c.phone}</td>
                      <td>{c.orders}</td>
                      <td className="cust-total">{c.totalSpent}</td>
                      <td>
                        <span
                          className={`cust-status-badge ${statusClassMap[c.status]}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="cust-muted">{c.joinedAt}</td>
                      <td>
                        <div className="cust-actions">
                          <button
                            className="cust-action-btn cust-view-btn"
                            onClick={() => handleView(c)}
                            aria-label="View customer"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="cust-action-btn cust-delete-btn"
                            onClick={() => handleDelete(c)}
                            aria-label="Delete customer"
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
          <div className="cust-pagination-bar">
            <span className="cust-showing">
              Showing {showingFrom} to {showingTo} of{" "}
              {totalCustomers.toLocaleString()} customers
            </span>
            <div className="cust-pagination-controls">
              <select
                className="cust-per-page"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <button
                className="cust-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>

              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={
                    p === currentPage
                      ? "cust-page-num cust-page-num-active"
                      : "cust-page-num"
                  }
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <span className="cust-page-dots">...</span>
              <button
                className={
                  currentPage === totalPages
                    ? "cust-page-num cust-page-num-active"
                    : "cust-page-num"
                }
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>

              <button
                className="cust-page-btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}