// src/admin/pages/Dashboard.jsx
import React, { useState } from "react";
import {
  Wallet,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./dashboard.css";

// ---------- Dummy Data (replace with API data later) ----------
const statCards = [
  {
    label: "Total Revenue",
    value: "PKR 125,430",
    change: "+ 12.5% from last week",
    icon: Wallet,
  },
  {
    label: "Total Orders",
    value: "256",
    change: "+ 8.3% from last week",
    icon: ShoppingCart,
  },
  {
    label: "Total Products",
    value: "84",
    change: "+ 5.7% from last week",
    icon: Package,
  },
  {
    label: "Total Customers",
    value: "1,540",
    change: "+ 10.2% from last week",
    icon: Users,
  },
];

const salesData = [
  { day: "May 25", value: 20000 },
  { day: "May 26", value: 35000 },
  { day: "May 27", value: 18000 },
  { day: "May 28", value: 32000 },
  { day: "May 29", value: 20000 },
  { day: "May 30", value: 42000 },
  { day: "May 31", value: 30000 },
];

const recentOrders = [
  { id: "#CS-00021", name: "Ahmed Raza", amount: "PKR 8,500", status: "Delivered", date: "May 31, 2025" },
  { id: "#CS-00022", name: "Ali Khan", amount: "PKR 4,200", status: "Processing", date: "May 31, 2025" },
  { id: "#CS-00023", name: "Hamza Ali", amount: "PKR 9,800", status: "Shipped", date: "May 30, 2025" },
  { id: "#CS-00024", name: "Usman Sheikh", amount: "PKR 3,650", status: "Pending", date: "May 30, 2025" },
  { id: "#CS-00025", name: "Sara Ahmed", amount: "PKR 6,250", status: "Delivered", date: "May 29, 2025" },
];

const topProducts = [
  { name: "Chef Knife Set", sold: 128, revenue: "PKR 45,760" },
  { name: "Non-Stick Fry Pan", sold: 96, revenue: "PKR 28,800" },
  { name: "Stainless Steel Cookware Set", sold: 74, revenue: "PKR 22,940" },
  { name: "Wooden Cutting Board", sold: 62, revenue: "PKR 8,680" },
  { name: "Silicone Kitchen Utensil Set", sold: 55, revenue: "PKR 6,050" },
];

// ✅ Customers - Sirf 3
const customers = [
  { name: "Ahmed Raza", email: "ahmedraza@email.com", orders: 12, spent: "PKR 85,430" },
  { name: "Ali Khan", email: "alikhan@email.com", orders: 9, spent: "PKR 62,280" },
  { name: "Hamza Ali", email: "hamzaali@email.com", orders: 8, spent: "PKR 48,760" },
];

const statusClass = {
  Delivered: "status-delivered",
  Processing: "status-processing",
  Shipped: "status-shipped",
  Pending: "status-pending",
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">
          {/* Welcome + Date Range */}
          <div className="dashboard-topbar">
            <div>
              <h2 className="welcome-text">Welcome back, Admin! 👋</h2>
              <p className="welcome-subtext">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="date-range-picker">
              <Calendar size={16} />
              <span>May 25, 2025 - May 31, 2025</span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stat-cards-grid">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className="stat-card" key={card.label}>
                  <div className="stat-icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <div className="stat-info">
                    <p className="stat-label">{card.label}</p>
                    <h3 className="stat-value">{card.value}</h3>
                    <span className="stat-change">↑ {card.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sales Overview + Recent Orders */}
          <div className="dashboard-row">
            <div className="panel sales-panel">
              <div className="panel-header">
                <h3>Sales Overview</h3>
                <button className="panel-filter">
                  This Week <ChevronDown size={14} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e0983f" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#e0983f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="#8a8a8f" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#8a8a8f"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1f1f26",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#e0983f"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                    dot={{ r: 4, fill: "#e0983f", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="panel orders-panel">
              <div className="panel-header">
                <h3>Recent Orders</h3>
                <a className="view-all" href="#!">View All</a>
              </div>
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div className="order-row" key={order.id}>
                    <div className="order-icon">
                      <ShoppingCart size={16} />
                    </div>
                    <div className="order-info">
                      <span className="order-id">{order.id}</span>
                      <span className="order-name">{order.name}</span>
                    </div>
                    <div className="order-status-col">
                      <span className={`status-badge ${statusClass[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <div className="order-amount">{order.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Selling Products + Customers Overview */}
          <div className="dashboard-row">
            <div className="panel">
              <div className="panel-header">
                <h3>Top Selling Products</h3>
                <a className="view-all" href="#!">View All</a>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.name}>
                      <td className="product-cell">
                        <span className="product-thumb" />
                        {p.name}
                      </td>
                      <td>{p.sold}</td>
                      <td>{p.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Customers Overview</h3>
                <a className="view-all" href="#!">View All</a>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.email}>
                      <td className="customer-cell">
                        <span className="customer-avatar">
                          <Users size={14} />
                        </span>
                        {c.name}
                      </td>
                      <td>{c.email}</td>
                      <td>{c.orders}</td>
                      <td>{c.spent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;