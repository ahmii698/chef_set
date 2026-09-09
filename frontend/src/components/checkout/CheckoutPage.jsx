// src/components/checkout/CheckoutPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutFlow from "./CheckoutFlow";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Cart se navigate karte waqt state ke through cartItems bheje gaye the
  const cartItems = location.state?.cartItems || [];

  // Agar koi direct /checkout URL par aa jaye bina cart se aaye,
  // to empty cart state dikhao aur products page ka link do
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-empty">
        <div className="checkout-page-empty-card">
          <span className="checkout-page-empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Please add items to your cart before proceeding to checkout.</p>
          <button
            className="btn-primary"
            type="button"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <CheckoutFlow />
    </div>
  );
}