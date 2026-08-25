// src/common/header.jsx (Full Navigation)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <h1>CHEFSET</h1>
          <span className="tagline">Built for the Serious Chef</span>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link></li>
            <li><Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>Products</Link></li>
            <li><Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link></li>
            <li><Link to="/testimonials" className={`nav-link ${location.pathname === '/testimonials' ? 'active' : ''}`}>Testimonials</Link></li>
            <li><Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link></li>
            <li><Link to="/billing" className={`nav-link ${location.pathname === '/billing' ? 'active' : ''}`}>Billing</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;