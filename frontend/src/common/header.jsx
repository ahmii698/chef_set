// src/common/header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCart } from '../utils/cart';
import { getWishlist } from '../utils/wishlist';
import { API_URL, STORAGE_URL } from '../../config';
import './header.css';

const Header = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [hideHeader, setHideHeader] = useState(false);
  
  // ✅ Navbar state
  const [navbar, setNavbar] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===== FETCH NAVBAR DATA =====
  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const response = await fetch(`${API_URL}/navbar`);
        const data = await response.json();
        setNavbar(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching navbar:', error);
        setLoading(false);
      }
    };
    fetchNavbar();
  }, []);

  // ===== CART & WISHLIST COUNTS =====
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

  // ===== HEADER HIDE/SCROLL LOGIC =====
  useEffect(() => {
    const handleScroll = () => {
      const animEl = document.querySelector('.scroll-wrapper');

      if (!animEl) {
        setHideHeader(false);
        return;
      }

      const rect = animEl.getBoundingClientRect();
      const scrolledIntoPage = window.scrollY > 40;
      const animationNotFinished = rect.bottom > 10;

      setHideHeader(scrolledIntoPage && animationNotFinished);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <header className="header">
        <div className="header-background">
          <div className="header-overlay">
            <div className="header-grid">
              <div className="logo-section">
                <h1>CHEF<span className="logo-accent">SET</span></h1>
                <span className="tagline">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ===== DEFAULT DATA (AGAR API SE NA AAYE TOH) =====
  const defaultMenuItems = [
    { name: 'HOME', link: '/', order: 1 },
    { name: 'ABOUT', link: '/about', order: 2 },
    { name: 'SHOP', link: '/products', order: 3 },
    { name: 'FAQ', link: '/faq', order: 4 },
    { name: 'CONTACT', link: '/contact', order: 5 }
  ];

  const menuItems = navbar?.menuItems?.length > 0 
    ? [...navbar.menuItems].sort((a, b) => a.order - b.order)
    : defaultMenuItems;

  const brandText = navbar?.brandText || 'CHEFSET';
  const tagline = navbar?.tagline || 'Built for the Serious Chef';
  const trackOrderText = navbar?.trackOrderText || 'TRACK ORDER';
  const searchPlaceholder = navbar?.searchPlaceholder || 'Search for premium kitchen equipment...';
  const logo = navbar?.logo || '';

  return (
    <header className={`header ${hideHeader ? 'header-hidden' : ''}`}>
      <div className="header-background">
        <div className="header-overlay">
          <div className="header-grid">
            {/* ===== LOGO SECTION ===== */}
            <div className="logo-section">
              {logo ? (
                <Link to="/" className="logo-link">
                  <img 
                    src={`${STORAGE_URL}/${logo}`} 
                    alt={brandText}
                    className="header-logo"
                  />
                </Link>
              ) : (
                <Link to="/" className="logo-link">
                  <h1>
                    {brandText.split('SET')[0]}
                    <span className="logo-accent">SET</span>
                  </h1>
                  <span className="tagline">{tagline}</span>
                </Link>
              )}
            </div>

            {/* ===== NAVIGATION ===== */}
            <nav className="navbar">
              <ul className="nav-links">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.link} 
                      className={`nav-link ${location.pathname === item.link ? 'active' : ''}`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                {/* Track Order - Dynamic */}
                <li>
                  <Link 
                    to="/trackorder" 
                    className={`nav-link ${location.pathname === '/trackorder' ? 'active' : ''}`}
                  >
                    {trackOrderText}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* ===== RIGHT SECTION ===== */}
            <div className="right-section">
              <div className="top-row">
                {/* Search Bar */}
                <div className="search-section">
                  <div className="search-container">
                    <input
                      type="text"
                      className="search-input"
                      placeholder={searchPlaceholder}
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