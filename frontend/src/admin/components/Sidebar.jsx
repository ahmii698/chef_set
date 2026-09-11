// src/admin/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Package,
  ShoppingCart,
  Users,
  FolderKanban,
  MessageSquareQuote,
  HelpCircle,
  Info,
  Mail,
  Bell,
} from "lucide-react";
import "./Sidebar.css";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Home", icon: HomeIcon, path: "/admin/home" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { name: "Customers", icon: Users, path: "/admin/customers" },
  { name: "Categories", icon: FolderKanban, path: "/admin/categories" },
  { name: "Testimonials", icon: MessageSquareQuote, path: "/admin/testimonials" },
  { name: "FAQ", icon: HelpCircle, path: "/admin/faq" },
  { name: "About Us", icon: Info, path: "/admin/about-us" },
  { name: "Contact Us", icon: Mail, path: "/admin/contact-us" },
  { name: "Subscribe Us", icon: Bell, path: "/admin/subscribe-us" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1 className="logo-text">
          CHEF<span>SET</span>
        </h1>
        <p className="logo-subtitle">ADMIN PANEL</p>
      </div>

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