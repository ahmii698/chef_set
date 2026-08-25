// src/common/navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        </li>
        <li>
          <Link to="/products" className={`nav-link ${isActive('/products')}`}>Products</Link>
        </li>
        <li>
          <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
        </li>
        <li>
          <Link to="/testimonials" className={`nav-link ${isActive('/testimonials')}`}>Testimonials</Link>
        </li>
        <li>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
        </li>
        <li>
          <Link to="/billing" className={`nav-link ${isActive('/billing')}`}>Billing</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;