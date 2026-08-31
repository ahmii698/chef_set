// src/components/profile/profile.jsx
import React from "react";
import { 
  FiLogOut, 
  FiShoppingBag, 
  FiPackage, 
  FiHeart, 
  FiTag, 
  FiClipboard, 
  FiSettings, 
  FiUser, 
  FiMapPin, 
  FiLock, 
  FiBell, 
  FiHeadphones,
  FiChevronRight
} from "react-icons/fi";
import "./profile.css";

const stats = [
  {
    icon: FiShoppingBag,
    label: "Total Spent",
    value: "$1,248.70",
    sub: "All time purchases",
  },
  {
    icon: FiPackage,
    label: "Total Orders",
    value: "12",
    sub: "All orders placed",
  },
  {
    icon: FiHeart,
    label: "Wishlist Items",
    value: "5",
    sub: "Saved in wishlist",
  },
  {
    icon: FiTag,
    label: "Pending Orders",
    value: "2",
    sub: "Awaiting dispatch",
  },
];

const orders = [
  {
    id: "CS-000245",
    image: "/images/chi1.png",
    date: "May 18, 2024",
    items: "3 Items",
    status: "Delivered",
    price: "$236.75",
  },
  {
    id: "CS-000221",
    image: "/images/chi2.png",
    date: "May 05, 2024",
    items: "2 Items",
    status: "Shipped",
    price: "$129.99",
  },
  {
    id: "CS-000198",
    image: "/images/chi3.png",
    date: "Apr 25, 2024",
    items: "1 Item",
    status: "Processing",
    price: "$39.99",
  },
  {
    id: "CS-000175",
    image: "/images/p1.png",
    date: "Apr 10, 2024",
    items: "4 Items",
    status: "Delivered",
    price: "$189.99",
  },
];

const settings = [
  {
    icon: FiUser,
    title: "Edit Profile",
    desc: "Update your personal information",
  },
  {
    icon: FiMapPin,
    title: "Manage Addresses",
    desc: "Add, edit or remove addresses",
  },
  {
    icon: FiLock,
    title: "Change Password",
    desc: "Update your account password",
  },
  {
    icon: FiBell,
    title: "Notification Settings",
    desc: "Manage email & SMS preferences",
  },
];

const statusClass = {
  Delivered: "pr-status-delivered",
  Shipped: "pr-status-shipped",
  Processing: "pr-status-processing",
};

function Profile() {
  const handleLogout = () => {
    console.log("logout");
  };

  const handleViewAllOrders = () => {
    console.log("view all orders");
  };

  const handleSettingClick = (title) => {
    console.log("open setting", title);
  };

  const handleContactSupport = () => {
    console.log("contact support");
  };

  return (
    <div className="pr-page">
      <div className="pr-header">
        <div>
          <h1 className="pr-title">My Profile</h1>
          <div className="pr-breadcrumb">
            <span>Home</span>
            <span className="pr-breadcrumb-sep">›</span>
            <span className="pr-breadcrumb-active">My Profile</span>
          </div>
        </div>
        <button className="pr-btn pr-btn-outline" onClick={handleLogout}>
          <FiLogOut size={16} />
          Logout
        </button>
      </div>

      <div className="pr-stats-row">
        {stats.map((s) => (
          <div className="pr-stat-card" key={s.label}>
            <div className="pr-stat-icon">
              <s.icon size={20} />
            </div>
            <div>
              <div className="pr-stat-label">{s.label}</div>
              <div className="pr-stat-value">{s.value}</div>
              <div className="pr-stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pr-content">
        <div className="pr-panel pr-orders-panel">
          <div className="pr-panel-header">
            <div className="pr-panel-heading">
              <FiClipboard size={16} />
              <span>Recent Orders</span>
            </div>
            <button className="pr-link-btn" onClick={handleViewAllOrders}>
              View All Orders
              <FiChevronRight size={14} />
            </button>
          </div>

          <div className="pr-orders-list">
            {orders.map((o) => (
              <div className="pr-order-row" key={o.id}>
                <img src={o.image} alt={o.id} className="pr-order-thumb" />
                <div className="pr-order-info">
                  <div className="pr-order-id">Order #{o.id}</div>
                  <div className="pr-order-meta">
                    {o.date} • {o.items}
                  </div>
                </div>
                <span className={`pr-status-badge ${statusClass[o.status]}`}>
                  {o.status}
                </span>
                <div className="pr-order-price">{o.price}</div>
                <FiChevronRight size={16} className="pr-order-arrow" />
              </div>
            ))}
          </div>
        </div>

        <div className="pr-panel pr-settings-panel">
          <div className="pr-panel-header">
            <div className="pr-panel-heading">
              <FiSettings size={16} />
              <span>Account Settings</span>
            </div>
          </div>

          <div className="pr-settings-list">
            {settings.map((s) => (
              <button
                className="pr-settings-row"
                key={s.title}
                onClick={() => handleSettingClick(s.title)}
              >
                <div className="pr-settings-icon">
                  <s.icon size={16} />
                </div>
                <div className="pr-settings-info">
                  <div className="pr-settings-title">{s.title}</div>
                  <div className="pr-settings-desc">{s.desc}</div>
                </div>
                <FiChevronRight size={16} className="pr-settings-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pr-help-footer">
        <div className="pr-help-left">
          <div className="pr-help-icon">
            <FiHeadphones size={20} />
          </div>
          <div>
            <div className="pr-help-title">Need Help?</div>
            <div className="pr-help-desc">Our support team is here to help you.</div>
          </div>
        </div>
        <button className="pr-btn pr-btn-primary" onClick={handleContactSupport}>
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default Profile;