import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Package,
  CheckCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./Orders.css";

// ---------------- Dummy Data ----------------
const ordersData = [
  {
    id: "#CS-00025",
    customer: "Ahmed Raza",
    email: "ahmedraza@email.com",
    date: "May 31, 2025",
    time: "10:45 AM",
    total: "PKR 8,500",
    payment: "Cash on Delivery",
    status: "Delivered",
  },
  {
    id: "#CS-00024",
    customer: "Ali Khan",
    email: "alikhan@email.com",
    date: "May 31, 2025",
    time: "09:30 AM",
    total: "PKR 4,200",
    payment: "JazzCash",
    status: "Processing",
  },
  {
    id: "#CS-00023",
    customer: "Hamza Ali",
    email: "hamzaali@email.com",
    date: "May 30, 2025",
    time: "06:15 PM",
    total: "PKR 9,800",
    payment: "EasyPaisa",
    status: "Shipped",
  },
  {
    id: "#CS-00022",
    customer: "Usman Sheikh",
    email: "usman@email.com",
    date: "May 30, 2025",
    time: "02:40 PM",
    total: "PKR 3,650",
    payment: "Cash on Delivery",
    status: "Pending",
  },
  {
    id: "#CS-00021",
    customer: "Sara Ahmed",
    email: "sara@email.com",
    date: "May 29, 2025",
    time: "11:20 AM",
    total: "PKR 6,250",
    payment: "Credit Card",
    status: "Delivered",
  },
  {
    id: "#CS-00020",
    customer: "Bilal Hussain",
    email: "bilal@email.com",
    date: "May 29, 2025",
    time: "10:05 AM",
    total: "PKR 2,450",
    payment: "JazzCash",
    status: "Processing",
  },
  {
    id: "#CS-00019",
    customer: "Zain Abbas",
    email: "zainabbas@email.com",
    date: "May 28, 2025",
    time: "08:50 PM",
    total: "PKR 7,150",
    payment: "EasyPaisa",
    status: "Shipped",
  },
  {
    id: "#CS-00018",
    customer: "Noman Khan",
    email: "noman@email.com",
    date: "May 28, 2025",
    time: "03:30 PM",
    total: "PKR 1,850",
    payment: "Cash on Delivery",
    status: "Delivered",
  },
  {
    id: "#CS-00017",
    customer: "Irfan Ahmed",
    email: "irfan@email.com",
    date: "May 27, 2025",
    time: "01:25 PM",
    total: "PKR 5,420",
    payment: "Credit Card",
    status: "Pending",
  },
  {
    id: "#CS-00016",
    customer: "Muhammad Usman",
    email: "usman2@email.com",
    date: "May 27, 2025",
    time: "12:10 PM",
    total: "PKR 3,200",
    payment: "EasyPaisa",
    status: "Delivered",
  },
];

const statusOptions = ["All Status", "Pending", "Processing", "Shipped", "Delivered"];
const paymentOptions = [
  "All Payment Methods",
  "Cash on Delivery",
  "JazzCash",
  "EasyPaisa",
  "Credit Card",
];

const statusClassMap = {
  Delivered: "status-delivered",
  Processing: "status-processing",
  Shipped: "status-shipped",
  Pending: "status-pending",
};

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Methods");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalOrders = 256;
  const totalRevenue = "PKR 1,245,430";
  const pendingOrders = 32;
  const completedOrders = 180;
  const totalPages = 26;

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "All Payment Methods" || order.payment === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [search, statusFilter, paymentFilter]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredOrders.map((o) => o.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleViewOrder = (order) => {
    console.log("View order:", order.id);
    // navigate(`/admin/orders/${order.id}`) can be added here
  };

  return (
    <div className="orders-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="orders-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="orders-content">
          {/* Header */}
          <div className="orders-header">
            <h1 className="orders-title">Orders</h1>
            <div className="orders-search">
              <Search size={16} className="orders-search-icon" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="orders-stats">
            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <Briefcase size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Orders</p>
                <h2 className="stat-value">{totalOrders}</h2>
                <span className="stat-change positive">↑ 8.3% from last week</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <Package size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Revenue</p>
                <h2 className="stat-value">{totalRevenue}</h2>
                <span className="stat-change positive">↑ 12.5% from last week</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <Briefcase size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Pending Orders</p>
                <h2 className="stat-value">{pendingOrders}</h2>
                <span className="stat-change neutral">In Processing</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon icon-orange">
                <CheckCircle size={20} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Completed Orders</p>
                <h2 className="stat-value">{completedOrders}</h2>
                <span className="stat-change positive">Completed</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="orders-filters">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="filter-select"
            >
              {paymentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button className="filter-date">
              <Calendar size={16} />
              <span>May 25, 2025 - May 31, 2025</span>
            </button>

            <button className="filter-btn">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>

          {/* Table */}
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        selectedRows.length === filteredOrders.length &&
                        filteredOrders.length > 0
                      }
                    />
                  </th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th className="action-col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-results">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(order.id)}
                          onChange={() => toggleSelectRow(order.id)}
                        />
                      </td>
                      <td className="order-id">{order.id}</td>
                      <td>
                        <div className="customer-cell">
                          <span className="customer-name">{order.customer}</span>
                          <span className="customer-email">{order.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <span>{order.date}</span>
                          <span className="date-time">{order.time}</span>
                        </div>
                      </td>
                      <td className="order-total">{order.total}</td>
                      <td>{order.payment}</td>
                      <td>
                        <span className={`status-badge ${statusClassMap[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="orders-pagination">
            <span className="pagination-info">
              Showing 1 to {filteredOrders.length} of {totalOrders} orders
            </span>
            <div className="pagination-controls">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={`page-btn ${currentPage === 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              <button
                className={`page-btn ${currentPage === 2 ? "active" : ""}`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>
              <button
                className={`page-btn ${currentPage === 3 ? "active" : ""}`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>
              <span className="page-dots">...</span>
              <button
                className={`page-btn ${currentPage === totalPages ? "active" : ""}`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;