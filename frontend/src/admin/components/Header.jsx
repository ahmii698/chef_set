// src/common/header.jsx
import React, { useState } from "react";
import { Search, Bell, ChevronDown, UserCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ 
  onToggleSidebar, 
  adminName = "Admin", 
  adminRole = "Super Admin", 
  notificationCount = 4 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate("/admin/profile");
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    // Logout logic here (clear token, etc.)
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      {/* Left: Hamburger */}
      <button className="menu-toggle-btn" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>

      {/* Center: Search */}
      <div className="header-search">
        <Search size={16} className="search-icon" />
        <input type="text" placeholder="Search for anything..." />
      </div>

      {/* Right: Notification + Profile */}
      <div className="header-right">
        <div className="notification-wrapper">
          <Bell size={20} className="notification-icon" />
          {notificationCount > 0 && (
            <span className="notification-badge">{notificationCount}</span>
          )}
        </div>

        <div
          className="admin-profile"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <UserCircle size={32} className="admin-avatar" />
          <div className="admin-info">
            <span className="admin-name">{adminName}</span>
            <span className="admin-role">{adminRole}</span>
          </div>
          <ChevronDown
            size={16}
            className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}
          />

          {dropdownOpen && (
            <div className="admin-dropdown">
              <button onClick={handleProfile}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;