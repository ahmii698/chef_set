// src/admin/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  ChevronDown,
  Mail,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { API_URL, STORAGE_URL } from "../../../config";
import "./Dashboard.css";

const statusClass = {
  delivered: "status-delivered",
  processing: "status-processing",
  shipped: "status-shipped",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [loading, setLoading] = useState(true);
  const [salesLoading, setSalesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);

  // ===== TOP FILTER (Date Range) =====
  const [dateFilter, setDateFilter] = useState("all");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [startMonth, setStartMonth] = useState("1");
  const [startYear, setStartYear] = useState(new Date().getFullYear().toString());
  const [endMonth, setEndMonth] = useState((new Date().getMonth() + 1).toString());
  const [endYear, setEndYear] = useState(new Date().getFullYear().toString());
  const [specificDate, setSpecificDate] = useState("");
  const [subMode, setSubMode] = useState("month");

  // ===== GRAPH FILTER =====
  const [graphFilter, setGraphFilter] = useState("weekly");
  const [showGraphMenu, setShowGraphMenu] = useState(false);
  const [graphStartMonth, setGraphStartMonth] = useState("1");
  const [graphStartYear, setGraphStartYear] = useState(new Date().getFullYear().toString());
  const [graphEndMonth, setGraphEndMonth] = useState((new Date().getMonth() + 1).toString());
  const [graphEndYear, setGraphEndYear] = useState(new Date().getFullYear().toString());
  const [graphSpecificDate, setGraphSpecificDate] = useState("");
  const [graphSubMode, setGraphSubMode] = useState("month");

  const dateFilterRef = useRef(null);
  const graphFilterRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(e.target)) {
        setShowDateMenu(false);
      }
      if (graphFilterRef.current && !graphFilterRef.current.contains(e.target)) {
        setShowGraphMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ==================== FETCH STATS ====================
  const fetchStats = async (rangeType = dateFilter, params = {}) => {
    try {
      setStatsLoading(true);
      let url = `${API_URL}/dashboard/stats?range=${rangeType}`;

      if (rangeType === "custom" && params.startDate && params.endDate) {
        url += `&startDate=${params.startDate}&endDate=${params.endDate}`;
      } else if (rangeType === "specific" && params.specificDate) {
        url += `&specificDate=${params.specificDate}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setStats(
        data && typeof data === "object"
          ? data
          : { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 }
      );
    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchSales = async (rangeType = graphFilter, params = {}) => {
    try {
      setSalesLoading(true);
      let url = `${API_URL}/dashboard/sales?range=${rangeType}`;

      if (rangeType === "custom" && params.startDate && params.endDate) {
        url += `&startDate=${params.startDate}&endDate=${params.endDate}`;
      } else if (rangeType === "specific" && params.specificDate) {
        url += `&specificDate=${params.specificDate}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setSalesData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Sales fetch error:", error);
      setSalesData([]);
    } finally {
      setSalesLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/recent-orders`);
      const data = await res.json();
      setRecentOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Recent orders fetch error:", error);
      setRecentOrders([]);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/top-products`);
      const data = await res.json();
      setTopProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Top products fetch error:", error);
      setTopProducts([]);
    }
  };

  const fetchRecentSubscribers = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/recent-subscribers`);
      const data = await res.json();
      setRecentSubscribers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Subscribers fetch error:", error);
      setRecentSubscribers([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats("all"),
        fetchSales("weekly"),
        fetchRecentOrders(),
        fetchTopProducts(),
        fetchRecentSubscribers(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // ==================== TOP DATE FILTER HANDLERS ====================
  const handleDateFilter = (newRange) => {
    if (newRange === "custom" || newRange === "specific") {
      setDateFilter(newRange);
      return;
    }
    setDateFilter(newRange);
    setShowDateMenu(false);
    fetchStats(newRange);
  };

  const handleCustomDateApply = () => {
    const sMonth = parseInt(startMonth);
    const sYear = parseInt(startYear);
    const eMonth = parseInt(endMonth);
    const eYear = parseInt(endYear);

    if (!sMonth || !sYear || !eMonth || !eYear) {
      alert("Please select start and end month/year");
      return;
    }

    const startDate = new Date(sYear, sMonth - 1, 1);
    const endDate = new Date(eYear, eMonth, 0);

    if (startDate > endDate) {
      alert("Start date end date se pehle hona chahiye");
      return;
    }

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    setDateFilter("custom");
    fetchStats("custom", { startDate: startStr, endDate: endStr });
    setShowDateMenu(false);
  };

  const handleSpecificDateApply = () => {
    if (!specificDate) {
      alert("Please select a date");
      return;
    }
    setDateFilter("specific");
    fetchStats("specific", { specificDate });
    setShowDateMenu(false);
  };

  // ==================== GRAPH FILTER HANDLERS ====================
  const handleGraphFilter = (newRange) => {
    if (newRange === "custom" || newRange === "specific") {
      setGraphFilter(newRange);
      return;
    }
    setGraphFilter(newRange);
    setShowGraphMenu(false);
    fetchSales(newRange);
  };

  const handleGraphCustomApply = () => {
    const sMonth = parseInt(graphStartMonth);
    const sYear = parseInt(graphStartYear);
    const eMonth = parseInt(graphEndMonth);
    const eYear = parseInt(graphEndYear);

    if (!sMonth || !sYear || !eMonth || !eYear) {
      alert("Please select start and end month/year");
      return;
    }

    const startDate = new Date(sYear, sMonth - 1, 1);
    const endDate = new Date(eYear, eMonth, 0);

    if (startDate > endDate) {
      alert("Start date end date se pehle hona chahiye");
      return;
    }

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    setGraphFilter("custom");
    fetchSales("custom", { startDate: startStr, endDate: endStr });
    setShowGraphMenu(false);
  };

  const handleGraphSpecificApply = () => {
    if (!graphSpecificDate) {
      alert("Please select a date");
      return;
    }
    setGraphFilter("specific");
    fetchSales("specific", { specificDate: graphSpecificDate });
    setShowGraphMenu(false);
  };

  // ==================== FORMATTERS ====================
  const formatCurrency = (num) => `PKR ${Number(num || 0).toLocaleString()}`;

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${STORAGE_URL}/${img}`;
  };

  // ==================== LABELS ====================
  const getDateFilterLabel = () => {
    if (dateFilter === "all") return "All Time";
    if (dateFilter === "custom") {
      const sMonth = MONTHS[parseInt(startMonth) - 1] || "";
      const eMonth = MONTHS[parseInt(endMonth) - 1] || "";
      return `${sMonth} ${startYear} - ${eMonth} ${endYear}`;
    }
    if (dateFilter === "specific") {
      return specificDate ? formatDate(specificDate) : "Specific Date";
    }
    const map = {
      daily: "Today",
      weekly: "This Week",
      monthly: "This Month",
      yearly: "Last 4 Months",
    };
    return map[dateFilter] || "All Time";
  };

  const getGraphLabel = () => {
    if (graphFilter === "custom") {
      const sMonth = MONTHS[parseInt(graphStartMonth) - 1] || "";
      const eMonth = MONTHS[parseInt(graphEndMonth) - 1] || "";
      return `${sMonth} ${graphStartYear} - ${eMonth} ${graphEndYear}`;
    }
    if (graphFilter === "specific") {
      return graphSpecificDate ? formatDate(graphSpecificDate) : "Specific Date";
    }
    const map = {
      daily: "Today",
      weekly: "This Week",
      monthly: "This Month",
      yearly: "Last 4 Months",
    };
    return map[graphFilter] || "This Week";
  };

  const statCards = [
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: Wallet },
    { label: "Total Orders", value: (stats.totalOrders || 0).toString(), icon: ShoppingCart },
    { label: "Total Products", value: (stats.totalProducts || 0).toString(), icon: Package },
    { label: "Total Customers", value: (stats.totalCustomers || 0).toLocaleString(), icon: Users },
  ];

  if (loading) {
    return (
      <div className="dashboard-layout">
        <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
          <Sidebar />
        </div>
        <div className="dashboard-main">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="dashboard-content">
            <div className="dashboard-loading">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="dashboard-content">
          {/* Welcome + Date Filter (Top Right) */}
          <div className="dashboard-topbar">
            <div>
              <h2 className="welcome-text">Welcome back, Admin! 👋</h2>
              <p className="welcome-subtext">
                Here's what's happening with your store today.
              </p>
            </div>

            {/* ✅ Date Filter — Top Right */}
            <div className="date-filter-wrapper" ref={dateFilterRef}>
              <button
                className="date-filter-btn"
                onClick={() => setShowDateMenu(!showDateMenu)}
              >
                <Calendar size={16} />
                <span>{getDateFilterLabel()}</span>
                <ChevronDown size={14} />
              </button>

              {showDateMenu && (
                <div className="date-filter-menu">
                  <p className="date-filter-menu-title">Filter Dashboard</p>

                  {[
                    { key: "all", label: "All Time" },
                    { key: "daily", label: "Today" },
                    { key: "weekly", label: "This Week" },
                    { key: "monthly", label: "This Month" },
                    { key: "yearly", label: "Last 4 Months" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      className={`date-filter-item ${
                        dateFilter === opt.key ? "active" : ""
                      }`}
                      onClick={() => handleDateFilter(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}

                  <div className="date-filter-custom">
                    <div className="date-filter-tabs">
                      <button
                        className={`date-filter-tab ${
                          subMode === "month" ? "active" : ""
                        }`}
                        onClick={() => setSubMode("month")}
                      >
                        Month Range
                      </button>
                      <button
                        className={`date-filter-tab ${
                          subMode === "date" ? "active" : ""
                        }`}
                        onClick={() => setSubMode("date")}
                      >
                        Specific Date
                      </button>
                    </div>

                    {subMode === "month" ? (
                      <>
                        <div className="date-filter-row">
                          <select
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                          >
                            {MONTHS.map((m, i) => (
                              <option key={i} value={i + 1}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Year"
                            value={startYear}
                            onChange={(e) => setStartYear(e.target.value)}
                            min="2020"
                            max="2030"
                          />
                        </div>
                        <div className="date-filter-row">
                          <select
                            value={endMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                          >
                            {MONTHS.map((m, i) => (
                              <option key={i} value={i + 1}>
                                {m}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Year"
                            value={endYear}
                            onChange={(e) => setEndYear(e.target.value)}
                            min="2020"
                            max="2030"
                          />
                        </div>
                        <button
                          className="date-filter-apply"
                          onClick={handleCustomDateApply}
                        >
                          Apply Range
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="date"
                          className="date-filter-date-input"
                          value={specificDate}
                          onChange={(e) => setSpecificDate(e.target.value)}
                        />
                        <button
                          className="date-filter-apply"
                          onClick={handleSpecificDateApply}
                        >
                          Apply Date
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
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
                    <h3 className="stat-value">
                      {statsLoading ? "..." : card.value}
                    </h3>
                    <span className="stat-change">↑ 12.5% from last week</span>
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
                <div className="range-filter-wrapper" ref={graphFilterRef}>
                  <button
                    className="panel-filter"
                    onClick={() => setShowGraphMenu(!showGraphMenu)}
                  >
                    {getGraphLabel()} <ChevronDown size={14} />
                  </button>
                  {showGraphMenu && (
                    <div className="range-menu">
                      {["daily", "weekly", "monthly", "yearly"].map((r) => (
                        <button
                          key={r}
                          className={`range-menu-item ${
                            graphFilter === r ? "active" : ""
                          }`}
                          onClick={() => handleGraphFilter(r)}
                        >
                          {
                            {
                              daily: "Today",
                              weekly: "This Week",
                              monthly: "This Month",
                              yearly: "Last 4 Months",
                            }[r]
                          }
                        </button>
                      ))}

                      <div className="range-menu-custom">
                        <div className="date-filter-tabs">
                          <button
                            className={`date-filter-tab ${
                              graphSubMode === "month" ? "active" : ""
                            }`}
                            onClick={() => setGraphSubMode("month")}
                          >
                            Month Range
                          </button>
                          <button
                            className={`date-filter-tab ${
                              graphSubMode === "date" ? "active" : ""
                            }`}
                            onClick={() => setGraphSubMode("date")}
                          >
                            Specific Date
                          </button>
                        </div>

                        {graphSubMode === "month" ? (
                          <>
                            <div className="date-filter-row">
                              <select
                                value={graphStartMonth}
                                onChange={(e) =>
                                  setGraphStartMonth(e.target.value)
                                }
                              >
                                {MONTHS.map((m, i) => (
                                  <option key={i} value={i + 1}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                placeholder="Year"
                                value={graphStartYear}
                                onChange={(e) =>
                                  setGraphStartYear(e.target.value)
                                }
                                min="2020"
                                max="2030"
                              />
                            </div>
                            <div className="date-filter-row">
                              <select
                                value={graphEndMonth}
                                onChange={(e) =>
                                  setGraphEndMonth(e.target.value)
                                }
                              >
                                {MONTHS.map((m, i) => (
                                  <option key={i} value={i + 1}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="number"
                                placeholder="Year"
                                value={graphEndYear}
                                onChange={(e) =>
                                  setGraphEndYear(e.target.value)
                                }
                                min="2020"
                                max="2030"
                              />
                            </div>
                            <button
                              className="date-filter-apply"
                              onClick={handleGraphCustomApply}
                            >
                              Apply Range
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="date"
                              className="date-filter-date-input"
                              value={graphSpecificDate}
                              onChange={(e) =>
                                setGraphSpecificDate(e.target.value)
                              }
                            />
                            <button
                              className="date-filter-apply"
                              onClick={handleGraphSpecificApply}
                            >
                              Apply Date
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {salesLoading ? (
                <div className="chart-loading">Loading chart...</div>
              ) : salesData.length === 0 ? (
                <div className="chart-loading">No sales data for this range</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={salesData} barCategoryGap="25%">
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.05)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      stroke="#8a8a8f"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#8a8a8f"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) =>
                        v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v
                      }
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(224, 152, 63, 0.08)" }}
                      contentStyle={{
                        background: "#1f1f26",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#fff",
                      }}
                      formatter={(v) => [formatCurrency(v), "Revenue"]}
                    />
                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={50}
                    >
                      {salesData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === salesData.length - 1
                              ? "#e0983f"
                              : "#a8722e"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Recent Orders */}
            <div className="panel orders-panel">
              <div className="panel-header">
                <h3>Recent Orders</h3>
                <button
                  className="view-all"
                  onClick={() => navigate("/admin/orders")}
                >
                  View All
                </button>
              </div>
              <div className="orders-list">
                {recentOrders.length === 0 ? (
                  <div className="empty-state">No orders yet</div>
                ) : (
                  recentOrders.map((order) => (
                    <div className="order-row" key={order._id}>
                      <div className="order-icon">
                        <ShoppingCart size={16} />
                      </div>
                      <div className="order-info">
                        <span className="order-id">{order.orderId}</span>
                        <span className="order-name">{order.name}</span>
                      </div>
                      <div className="order-status-col">
                        <span
                          className={`status-badge ${
                            statusClass[order.status?.toLowerCase()] ||
                            "status-pending"
                          }`}
                        >
                          {order.status?.toUpperCase()}
                        </span>
                        <span className="order-date">
                          {formatDate(order.date)}
                        </span>
                      </div>
                      <div className="order-amount">
                        {formatCurrency(order.amount)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Top Products + Recent Subscribers */}
          <div className="dashboard-row">
            <div className="panel">
              <div className="panel-header">
                <h3>Top Selling Products</h3>
                <button
                  className="view-all"
                  onClick={() => navigate("/admin/products")}
                >
                  View All
                </button>
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
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        No products sold yet
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((p) => (
                      <tr key={p._id}>
                        <td className="product-cell">
                          {p.image ? (
                            <img
                              src={getImageUrl(p.image)}
                              alt={p.name}
                              className="product-thumb-img"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="product-thumb" />
                          )}
                          {p.name}
                        </td>
                        <td>{p.sold}</td>
                        <td>{formatCurrency(p.revenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Recent Subscribers</h3>
                <button
                  className="view-all"
                  onClick={() => navigate("/admin/subscribe-us")}
                >
                  View All
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="empty-state">
                        No subscribers yet
                      </td>
                    </tr>
                  ) : (
                    recentSubscribers.map((s) => (
                      <tr key={s._id}>
                        <td className="subscriber-cell">
                          <span className="subscriber-avatar">
                            <Mail size={14} />
                          </span>
                          {s.email}
                        </td>
                        <td>
                          {formatDate(
                            s.createdAt || s.created_at || s.subscribedAt || s.date
                          )}
                        </td>
                      </tr>
                    ))
                  )}
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