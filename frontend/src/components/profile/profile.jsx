// src/components/profile/profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiShoppingBag,
  FiPackage,
  FiHeart,
  FiTag,
  FiClipboard,
  FiSettings,
  FiUser,
  FiLock,
  FiTruck,
  FiHeadphones,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";
import { removeToken, getToken, verifyToken } from "../../services/authService";
import { getWishlist } from "../../utils/wishlist";
import { API_URL } from "../../../config";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [activeTab, setActiveTab] = useState("orders");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  // ===== CHECK AUTH & FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const result = await verifyToken();
        
        if (result.user) {
          setUser(result.user);
          setProfileForm({
            name: result.user.fullName || "",
            email: result.user.email || "",
            phone: result.user.phone || "",
          });
          
          await fetchOrders(result.user.email, token);
        }

        setWishlistCount(getWishlist().length);

      } catch (error) {
        console.error("❌ Error fetching data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ===== FETCH ORDERS =====
  const fetchOrders = async (userEmail, token) => {
    try {
      const ordersRes = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (ordersRes.ok) {
        const allOrders = await ordersRes.json();
        
        const userOrders = allOrders.filter(o => 
          o.email && o.email.toLowerCase() === userEmail?.toLowerCase()
        );
        
        setOrders(userOrders);
        
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const pendingOrders = userOrders.filter(o => o.status === 'pending').length;
        
        setOrderStats({
          totalSpent,
          totalOrders: userOrders.length,
          pendingOrders,
        });
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  // ===== MENU CLICK =====
  const handleMenuClick = (key) => {
    if (key === "trackOrder") {
      navigate("/trackorder");
      return;
    }
    setActiveTab(key);
  };

  // ===== CONTACT SUPPORT =====
  const handleContactSupport = () => {
    navigate("/contact");
  };

  // ===== PROFILE FORM =====
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // ===== PASSWORD FORM =====
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password updated successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.message || "Failed to update password");
      }
    } catch (error) {
      setPasswordError("Network error. Please try again.");
    }
  };

  // ===== STATUS CLASSES =====
  const statusClass = {
    pending: "pr-status-pending",
    processing: "pr-status-processing",
    shipped: "pr-status-shipped",
    delivered: "pr-status-delivered",
    cancelled: "pr-status-cancelled",
  };

  const menuItems = [
    { key: "orders", icon: FiClipboard, title: "Recent Orders", desc: "View your recent purchases" },
    { key: "editProfile", icon: FiUser, title: "Edit Profile", desc: "Update your personal information" },
    { key: "changePassword", icon: FiLock, title: "Change Password", desc: "Update your account password" },
    { key: "trackOrder", icon: FiTruck, title: "Track Order", desc: "Track your order status" },
  ];

  // ===== STATS =====
  const stats = [
    {
      icon: FiShoppingBag,
      label: "Total Spent",
      value: `PKR ${orderStats.totalSpent.toLocaleString()}`,
      sub: "All time purchases",
    },
    {
      icon: FiPackage,
      label: "Total Orders",
      value: orderStats.totalOrders.toString(),
      sub: "All orders placed",
    },
    {
      icon: FiHeart,
      label: "Wishlist Items",
      value: wishlistCount.toString(),
      sub: "Saved in wishlist",
    },
    {
      icon: FiTag,
      label: "Pending Orders",
      value: orderStats.pendingOrders.toString(),
      sub: "Awaiting approval",
    },
  ];

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="pr-page">
        <div className="pr-loading">Loading profile...</div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="pr-page">
      {/* ===== HEADER ===== */}
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

      {/* ===== STATS ===== */}
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

      {/* ===== CONTENT ===== */}
      <div className="pr-content">
        {/* LEFT: Account Settings menu */}
        <div className="pr-panel pr-settings-panel">
          <div className="pr-panel-header">
            <div className="pr-panel-heading">
              <FiSettings size={16} />
              <span>Account Settings</span>
            </div>
          </div>

          <div className="pr-settings-list">
            {menuItems.map((s) => (
              <button
                className={`pr-settings-row ${activeTab === s.key ? "active" : ""}`}
                key={s.key}
                onClick={() => handleMenuClick(s.key)}
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

        {/* RIGHT: dynamic content */}
        <div className="pr-panel pr-orders-panel">
          {/* ===== ORDERS TAB ===== */}
          {activeTab === "orders" && (
            <>
              <div className="pr-panel-header">
                <div className="pr-panel-heading">
                  <FiClipboard size={16} />
                  <span>Recent Orders</span>
                </div>
              </div>

              <div className="pr-orders-list">
                {/* ✅ STATUS HEADING - aligned to match pr-order-row columns exactly */}
                <div className="pr-orders-heading">
                  <span className="pr-orders-heading-id">Order ID</span>
                  <span className="pr-orders-heading-status">Status</span>
                  <span className="pr-orders-heading-total">Total</span>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="pr-no-orders">No orders yet.</div>
                ) : (
                  recentOrders.map((o) => (
                    <div className="pr-order-row" key={o._id || o.orderId}>
                      <div className="pr-order-info">
                        <div className="pr-order-id">Order #{o.orderId}</div>
                        <div className="pr-order-meta">
                          {new Date(o.createdAt).toLocaleDateString()} • {o.items?.length || 0} items
                        </div>
                      </div>
                      <span className={`pr-status-badge ${statusClass[o.status] || 'pr-status-pending'}`}>
                        {o.status?.toUpperCase() || 'PENDING'}
                      </span>
                      <div className="pr-order-price">PKR {o.total?.toLocaleString() || '0'}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ===== EDIT PROFILE TAB ===== */}
          {activeTab === "editProfile" && (
            <div className="pr-panel-body">
              {saveSuccess && (
                <div className="pr-success-message">
                  <FiCheck size={16} />
                  Profile updated successfully!
                </div>
              )}

              <form className="pr-form" onSubmit={handleProfileSubmit}>
                <div className="pr-avatar-row">
                  <div className="pr-avatar-placeholder">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                </div>

                <div className="pr-form-group">
                  <label className="pr-label" htmlFor="name">Full Name</label>
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    className="pr-input" 
                    placeholder="Enter your full name" 
                    value={profileForm.name} 
                    onChange={handleProfileChange} 
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label" htmlFor="email">Email Address</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    className="pr-input" 
                    value={profileForm.email} 
                    disabled 
                  />
                  <small className="pr-field-note">Email cannot be changed</small>
                </div>

                <div className="pr-form-group">
                  <label className="pr-label" htmlFor="phone">Phone Number</label>
                  <input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    className="pr-input" 
                    placeholder="Enter your phone number" 
                    value={profileForm.phone} 
                    onChange={handleProfileChange} 
                  />
                </div>

                <div className="pr-form-actions">
                  <button type="submit" className="pr-btn pr-btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* ===== CHANGE PASSWORD TAB ===== */}
          {activeTab === "changePassword" && (
            <div className="pr-panel-body">
              {passwordError && <div className="pr-error-message">{passwordError}</div>}
              {passwordSuccess && <div className="pr-success-message">{passwordSuccess}</div>}

              <form className="pr-form" onSubmit={handlePasswordSubmit}>
                <div className="pr-form-group">
                  <label className="pr-label" htmlFor="currentPassword">Current Password</label>
                  <input 
                    id="currentPassword" 
                    name="currentPassword" 
                    type="password" 
                    className="pr-input" 
                    placeholder="Enter current password" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange} 
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label" htmlFor="newPassword">New Password</label>
                  <input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    className="pr-input" 
                    placeholder="Enter new password (min 6 characters)" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange} 
                  />
                </div>

                <div className="pr-form-group">
                  <label className="pr-label" htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    className="pr-input" 
                    placeholder="Re-enter new password" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChange} 
                  />
                </div>

                <div className="pr-form-actions">
                  <button type="submit" className="pr-btn pr-btn-primary">Update Password</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ===== HELP FOOTER ===== */}
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