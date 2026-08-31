// src/components/contact.jsx
import React, { useState } from 'react';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaTag,
  FaPen,
  FaShieldAlt,
  FaHeadset,
  FaCheckCircle,
  FaAward,
  FaLock,
} from 'react-icons/fa';
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
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        {/* Left Panel - Info */}
        <div className="contact-page-left">
          <span className="contact-page-label">CONTACT US</span>
          <h2 className="contact-page-heading">WE'D LOVE TO <span>HEAR FROM YOU.</span></h2>
          <p className="contact-page-desc">
            Have a question or need assistance? Contact our team and we'll get back
            to you as soon as possible.
          </p>

          <div className="contact-page-detail">
            <span className="contact-page-icon-wrap">
              <FaPhoneAlt />
            </span>
            <div>
              <p className="contact-page-detail-title">CALL US</p>
              <p className="contact-page-detail-value">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="contact-page-detail">
            <span className="contact-page-icon-wrap">
              <FaEnvelope />
            </span>
            <div>
              <p className="contact-page-detail-title">EMAIL</p>
              <p className="contact-page-detail-value">info@chefset.com</p>
            </div>
          </div>

          <div className="contact-page-detail">
            <span className="contact-page-icon-wrap">
              <FaMapMarkerAlt />
            </span>
            <div>
              <p className="contact-page-detail-title">ADDRESS</p>
              <p className="contact-page-detail-value">123 Chef Street, New York, NY 10001</p>
            </div>
          </div>

          <div className="contact-page-detail">
            <span className="contact-page-icon-wrap">
              <FaClock />
            </span>
            <div>
              <p className="contact-page-detail-title">BUSINESS HOURS</p>
              <p className="contact-page-detail-value">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="contact-page-detail-value">Sat - Sun: Closed</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="contact-page-right">
          <h3 className="contact-page-form-title">SEND US A MESSAGE</h3>
          <p className="contact-page-form-sub">Fill out the form below and we'll reply to you soon.</p>

          <form className="contact-page-form" onSubmit={handleSubmit}>
            {/* Name and Email - 2 columns */}
            <div className="contact-page-form-row">
              <div className="contact-page-input-wrap">
                <FaUser className="contact-page-input-icon" />
                <input
                  type="text"
                  name="name"
                  className="contact-page-input"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-page-input-wrap">
                <FaEnvelope className="contact-page-input-icon" />
                <input
                  type="email"
                  name="email"
                  className="contact-page-input"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Subject - Full Width */}
            <div className="contact-page-input-wrap contact-page-full">
              <FaTag className="contact-page-input-icon" />
              <input
                type="text"
                name="subject"
                className="contact-page-input"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            {/* Message - Full Width */}
            <div className="contact-page-input-wrap contact-page-full contact-page-textarea-wrap">
              <FaPen className="contact-page-input-icon contact-page-textarea-icon" />
              <textarea
                name="message"
                className="contact-page-input contact-page-textarea"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-page-btn">SEND MESSAGE</button>

            <div className="contact-page-trust">
              <FaShieldAlt />
              <span>Your information is safe with us. We never share your data.</span>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Features */}
      <div className="contact-page-features">
        <div className="contact-page-feature">
          <span className="contact-page-feature-icon">
            <FaHeadset />
          </span>
          <div>
            <h4>FAST SUPPORT</h4>
            <p>We reply within 24 hours</p>
          </div>
        </div>

        <div className="contact-page-feature">
          <span className="contact-page-feature-icon">
            <FaCheckCircle />
          </span>
          <div>
            <h4>TRUSTED SERVICE</h4>
            <p>We care about our customers</p>
          </div>
        </div>

        <div className="contact-page-feature">
          <span className="contact-page-feature-icon">
            <FaAward />
          </span>
          <div>
            <h4>100% SATISFACTION</h4>
            <p>Your satisfaction is our priority</p>
          </div>
        </div>

        <div className="contact-page-feature">
          <span className="contact-page-feature-icon">
            <FaLock />
          </span>
          <div>
            <h4>SECURE &amp; PRIVATE</h4>
            <p>Your data is always protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;