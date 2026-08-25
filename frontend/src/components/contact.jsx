// src/components/contact.jsx
import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    payment: '',
    refunds: '',
    billing: '',
    order: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="contact">
      <div className="contact-header">
        <h1>WE'D LOVE TO HEAR FROM YOU.</h1>
        <p>PLEASE SUBMIT YOUR ADVERTISEMENT</p>
        <p className="contact-sub">
          Contact our team and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="contact-pricing">
        <div className="pricing-item">
          <h4>1st order</h4>
          <p>$100/day</p>
        </div>
        <div className="pricing-item">
          <h4>2nd order</h4>
          <p>$200/day</p>
        </div>
        <div className="pricing-item">
          <h4>3rd order</h4>
          <p>$300/day</p>
        </div>
        <div className="pricing-item">
          <h4>4th order</h4>
          <p>$400/day</p>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>NAME</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name Here"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>PHONE</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>PAYMENT</label>
            <input
              type="text"
              name="payment"
              placeholder="Payment Method"
              value={formData.payment}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>REFUNDS</label>
            <input
              type="text"
              name="refunds"
              placeholder="Refund Policy"
              value={formData.refunds}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>BILLING</label>
            <input
              type="text"
              name="billing"
              placeholder="Billing Address"
              value={formData.billing}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>ORDER</label>
            <input
              type="text"
              name="order"
              placeholder="Order Number"
              value={formData.order}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>MESSAGE</label>
            <textarea
              name="message"
              rows="4"
              placeholder="Your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">CHECK OUT TODAY</button>
      </form>
    </div>
  );
};

export default Contact;