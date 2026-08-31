// src/common/header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCart } from '../utils/cart';
import { getWishlist } from '../utils/wishlist';
import './header.css';

const Header = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCounts = () => {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    setCartCount(totalQty);
    setWishlistCount(getWishlist().length);
  };

  useEffect(() => {
    updateCounts();

    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);
    window.addEventListener('storage', updateCounts);

    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, []);

  useEffect(() => {
    updateCounts();
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-background">
        <div className="header-overlay">
          <div className="header-grid">
            {/* Logo Section */}
            <div className="logo-section">
              <h1>CHEF<span className="logo-accent">SET</span></h1>
              <span className="tagline">Built for the Serious Chef</span>
            </div>

            {/* Navigation */}
            <nav className="navbar">
              <ul className="nav-links">
                <li>
                  <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                    CONTACT
                  </Link>
                </li>
                <li>
                  <Link to="/trackorder" className={`nav-link ${location.pathname === '/trackorder' ? 'active' : ''}`}>
                    TRACK ORDER
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Icons + Search Section */}
            <div className="right-section">
              <div className="top-row">
                {/* Search Bar */}
                <div className="search-section">
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search for premium kitchen equipment..."
                    />
                    <button className="search-button">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Icons */}
                <div className="icon-group">
                  <Link to="/wishlist" className="icon-link" title="Wishlist">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span className="icon-badge">{wishlistCount}</span>
                  </Link>

                  <Link to="/cart" className="icon-link" title="Cart">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span className="icon-badge">{cartCount}</span>
                  </Link>

                  <Link to="/profile" className="icon-link" title="Account">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;