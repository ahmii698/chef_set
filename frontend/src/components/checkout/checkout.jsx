// src/components/checkout/checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../../config";
import "./checkout.css";

export default function Checkout({ onSubmit, loading: parentLoading, error: parentError }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  // Cart items from navigation state
  const cartItems = location.state?.cartItems || [];
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipcode: "",
    paymentMethod: "Bank Transfer",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  // Calculate totals
  useEffect(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    setSubtotal(sub);
    setTotal(sub + shipping);
  }, [cartItems, shipping]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Street address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    // ✅ Parent component ke onSubmit ko call karo
    if (onSubmit) {
      onSubmit(form);
    }
  };

  // Agar cart empty hai toh products page pe bhejo
  useEffect(() => {
    if (cartItems.length === 0 && !localLoading) {
      navigate('/products');
    }
  }, [cartItems, localLoading, navigate]);

  const isLoading = parentLoading || localLoading;
  const displayError = parentError || localError;

  return (
    <div className="billing-page">
      <div className="billing-form-panel">
        <div className="billing-header">
          <h1>Billing Details</h1>
          <p>Fill in your information to complete the order</p>
        </div>

        {displayError && <div className="error-message">{displayError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number <span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="03XX-XXXXXXX"
              required
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Street Address <span className="required">*</span>
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="House #, Street, Area"
              required
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
                placeholder="Karachi"
                required
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="zipcode">Zipcode</label>
              <input
                id="zipcode"
                name="zipcode"
                type="text"
                value={form.zipcode}
                onChange={handleChange}
                placeholder="75500"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">
              Payment Method <span className="required">*</span>
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Banking">Mobile Banking</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Order Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="Any special instructions..."
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "PLACING ORDER..." : "Proceed to Payment →"}
          </button>
        </form>
      </div>

      <aside className="order-summary-panel">
        <h2>Order Summary</h2>
        <p className="item-count">{cartItems.length} items</p>

        <div className="summary-items">
          {cartItems.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.name} x{item.qty}
              </span>
              <span>Rs. {(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="summary-line">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <span>Rs. {shipping.toLocaleString()}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>
      </aside>
    </div>
  );
}