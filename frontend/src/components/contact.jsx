// src/component/contact.jsx
import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      alert('Thank you! Your message has been sent.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left Info */}
        <div className="contact-info-panel">
          <span className="contact-label">CONTACT US</span>
          <h2>WE'D LOVE TO <span>HEAR FROM YOU.</span></h2>
          <p className="contact-desc">
            Have a question or need assistance? Contact our team and we'll get back
            to you as soon as possible.
          </p>

          <div className="contact-detail">
            <span className="contact-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div>
              <p className="contact-detail-title">CALL US</p>
              <p className="contact-detail-value">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16v16H4z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </span>
            <div>
              <p className="contact-detail-title">EMAIL</p>
              <p className="contact-detail-value">info@chefset.com</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div>
              <p className="contact-detail-title">ADDRESS</p>
              <p className="contact-detail-value">123 Chef Street, New York, NY 10001</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="contact-form-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="full-width"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="full-width"
              required
            ></textarea>
            <button type="submit" className="btn-send">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;