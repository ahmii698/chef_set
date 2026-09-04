import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderKanban,
  MessageSquareQuote,
  HelpCircle,
  Info,
  LogOut,
} from "lucide-react";
import "./sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { name: "Customers", icon: Users, path: "/admin/customers" },
  { name: "Categories", icon: FolderKanban, path: "/admin/categories" },
  { name: "Testimonials", icon: MessageSquareQuote, path: "/admin/testimonials" },
  { name: "FAQ", icon: HelpCircle, path: "/admin/faq" },
  { name: "About Us", icon: Info, path: "/admin/about-us" },
];

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h1 className="logo-text">
          CHEF<span>SET</span>
        </h1>
        <p className="logo-subtitle">ADMIN PANEL</p>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              <Icon size={18} className="sidebar-icon" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer image + Logout */}
      <div
        className="sidebar-footer"
        style={{ backgroundImage: `url(/images/chi1.png)` }}
      >
        <div className="sidebar-footer-overlay" />
       
       

      </div>
    </aside>
  );
};

export default Sidebar;