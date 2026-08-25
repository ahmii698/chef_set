// src/common/footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>CHEFSET</h3>
          <p>Premium kitchen equipment for the serious chef.</p>
          <p className="footer-tagline">Built for the Serious Chef.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/billing">Billing</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@chefset.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Chef Street</p>
          <p>New York, NY 10001</p>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#" className="social-link">📱</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📸</a>
            <a href="#" className="social-link">💼</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 CHEFSET. All rights reserved.</p>
        <p>Built for the Serious Chef.</p>
      </div>
    </footer>
  );
};

export default Footer;