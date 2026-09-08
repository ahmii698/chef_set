// src/components/contact.jsx
import React, { useState, useEffect } from 'react';
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
  FaSpinner,
} from 'react-icons/fa';
import { API_URL } from '../../config';
import './contact.css';

const Contact = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/contact`);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  // ===== SUBMIT HANDLER - SAVES TO DATABASE =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, subject, message } = formData;
    
    if (!name || !email || !message) {
      setSubmitStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/contact-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', text: data.message || 'Message sent successfully! 🎉' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus({ type: 'error', text: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // ===== ICON MAP =====
  const getIcon = (iconName) => {
    const icons = {
      phone: <FaPhoneAlt />,
      email: <FaEnvelope />,
      address: <FaMapMarkerAlt />,
      hours: <FaClock />,
      fast: <FaHeadset />,
      trust: <FaCheckCircle />,
      satisfaction: <FaAward />,
      secure: <FaLock />
    };
    return icons[iconName] || <FaPhoneAlt />;
  };

  // ✅ TIME ZONE FIX - Convert UTC to Local Time
  const formatLocalTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-PK', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="contact-page-wrapper">
        <div className="contact-loading">Loading...</div>
      </div>
    );
  }

  if (!data) return null;

  // ===== SORT DATA =====
  const contactInfo = [...(data.contactInfo || [])].sort((a, b) => a.order - b.order);
  const benefits = [...(data.benefits || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        {/* ===== LEFT PANEL - INFO ===== */}
        <div className="contact-page-left">
          <span className="contact-page-label">{data.title}</span>
          <h2 className="contact-page-heading">
            {data.subtitle?.split('FROM YOU.')[0]}
            <span>FROM YOU.</span>
          </h2>
          <p className="contact-page-desc">{data.formSubtitle}</p>

          {contactInfo.map((info, index) => (
            <div className="contact-page-detail" key={index}>
              <span className="contact-page-icon-wrap">
                {getIcon(info.icon)}
              </span>
              <div>
                <p className="contact-page-detail-title">{info.label}</p>
                {info.link ? (
                  <a href={info.link} className="contact-page-detail-value contact-page-link">
                    {info.value}
                  </a>
                ) : (
                  <p className="contact-page-detail-value">{info.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ===== RIGHT PANEL - FORM ===== */}
        <div className="contact-page-right">
          <h3 className="contact-page-form-title">{data.formTitle}</h3>
          <p className="contact-page-form-sub">{data.description}</p>

          {/* ✅ SUBMIT STATUS MESSAGE */}
          {submitStatus && (
            <div className={`contact-submit-status ${submitStatus.type}`}>
              {submitStatus.text}
            </div>
          )}

          <form className="contact-page-form" onSubmit={handleSubmit}>
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

            <button 
              type="submit" 
              className="contact-page-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FaSpinner className="contact-spinner" /> SENDING...
                </>
              ) : (
                data.buttonText || 'SEND MESSAGE'
              )}
            </button>

            <div className="contact-page-trust">
              <FaShieldAlt />
              <span>{data.footerText || 'Your information is safe with us. We never share your data.'}</span>
            </div>
          </form>
        </div>
      </div>

      {/* ===== BOTTOM FEATURES ===== */}
      <div className="contact-page-features">
        {benefits.map((benefit, index) => (
          <div className="contact-page-feature" key={index}>
            <span className="contact-page-feature-icon">
              {getIcon(benefit.icon)}
            </span>
            <div>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;