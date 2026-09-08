// src/common/footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, STORAGE_URL } from '../../config';
import './footer.css';

const Footer = () => {
  const [footer, setFooter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(`${API_URL}/footer`);
        const data = await response.json();
        setFooter(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching footer:', error);
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  // ✅ SUBSCRIBE HANDLER - API CALL
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Subscribed successfully! 🎉');
        setMessageType('success');
        setEmail('');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(data.message || 'Something went wrong');
        setMessageType('error');
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading) {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-loading">Loading...</div>
        </div>
      </footer>
    );
  }

  if (!footer) return null;

  const sortLinks = (links) => {
    if (!links) return [];
    return [...links].sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const quickLinks = sortLinks(footer.quickLinks?.links);
  const categories = sortLinks(footer.categories?.links);
  const supportLinks = sortLinks(footer.support?.links);

  const brandName = footer.brand?.name || 'CHEFSET';
  const brandTagline = footer.brand?.tagline || 'Built for the Serious Chef';
  const brandDesc = footer.brand?.description || 'Top-quality kitchen equipment trusted by professionals worldwide.';

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand-section">
          {footer.brand?.logo ? (
            <img 
              src={`${STORAGE_URL}/${footer.brand.logo}`} 
              alt={brandName}
              className="footer-logo"
            />
          ) : (
            <h3>
              {brandName.split('SET')[0]}
              <span className="logo-accent">SET</span>
            </h3>
          )}
          <p className="brand-desc">{brandDesc}</p>
          <p className="footer-tagline">{brandTagline}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>{footer.quickLinks?.title || 'QUICK LINKS'}</h4>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.link}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h4>{footer.categories?.title || 'CATEGORIES'}</h4>
          <ul>
            {categories.map((link) => (
              <li key={link.name}>
                <Link to={link.link}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>{footer.support?.title || 'SUPPORT'}</h4>
          <ul>
            {supportLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.link}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get In Touch */}
        <div className="footer-section footer-contact-section">
          <h4>{footer.contact?.title || 'GET IN TOUCH'}</h4>
          {footer.contact?.email && (
            <p className="contact-info">
              <span className="contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              {footer.contact.email}
            </p>
          )}
          {footer.contact?.phone && (
            <p className="contact-info">
              <span className="contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              {footer.contact.phone}
            </p>
          )}
          {footer.contact?.address && (
            <p className="contact-info">
              <span className="contact-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              {footer.contact.address}
            </p>
          )}
        </div>

        {/* Newsletter */}
        <div className="footer-section newsletter-section">
          <h4>{footer.newsletter?.title || 'STAY UPDATED'}</h4>
          <p className="newsletter-text">{footer.newsletter?.description || 'Subscribe to our newsletter and never miss our latest offers.'}</p>
          
          {/* ✅ MESSAGE DISPLAY */}
          {message && (
            <div className={`newsletter-message ${messageType}`}>
              {message}
            </div>
          )}

          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-wrapper">
              <input
                type="email"
                className="newsletter-input"
                placeholder={footer.newsletter?.placeholder || 'Enter your email'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (message) setMessage('');
                }}
                required
              />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>

          {/* Social Icons */}
          {footer.contact?.socialLinks?.length > 0 && (
            <div className="social-links">
              {footer.contact.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.platform}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    {social.platform?.toLowerCase() === 'facebook' && (
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    )}
                    {social.platform?.toLowerCase() === 'twitter' && (
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    )}
                    {social.platform?.toLowerCase() === 'instagram' && (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" />
                      </>
                    )}
                    {social.platform?.toLowerCase() === 'youtube' && (
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    )}
                    {social.platform?.toLowerCase() === 'linkedin' && (
                      <>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </>
                    )}
                    {!['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].includes(social.platform?.toLowerCase()) && (
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>{footer.copyright || '© 2026 CHEFSET. All rights reserved.'}</p>
        <p className="footer-bottom-tagline">{brandTagline}</p>
      </div>
    </footer>
  );
};

export default Footer;