// src/components/checkout/orderPlaced.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHourglassHalf,
  FaEnvelope,
  FaShieldAlt,
  FaBoxOpen,
  FaTruck,
  FaShoppingBag,
} from "react-icons/fa";
import "./orderPlaced.css";

export default function OrderPlaced({ 
  orderId, 
  onTrackOrder, 
  onContinueShopping, 
  orderData 
}) {
  const navigate = useNavigate();

  // Agar orderId nahi hai toh products page pe bhejo
  useEffect(() => {
    if (!orderId) {
      navigate('/products');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  // Use orderData or fallback to orderId
  const displayOrderId = orderData?.orderId || orderId;

  const handleTrackOrder = () => {
    if (onTrackOrder) {
      onTrackOrder();
    } else {
      navigate(`/trackorder?order=${displayOrderId}`);
    }
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="placed-page">
      <div className="placed-card">
        <div className="placed-icon">
          <FaHourglassHalf />
        </div>
        <h1>Order Placed!</h1>

        <div className="order-id-pill">
          <span>Order ID:</span>
          <strong>{displayOrderId}</strong>
        </div>

        <p className="placed-success">Your order has been placed successfully!</p>

        <div className="pending-box">
          <span className="pending-icon">
            <FaHourglassHalf />
          </span>
          <p>
            Your order is pending admin approval. Please wait while we verify
            your payment.
          </p>
        </div>

        <div className="next-steps-box">
          <h4>WHAT'S NEXT?</h4>
          <ul>
            <li>
              <span className="step-icon"><FaEnvelope /></span> You will receive order
              confirmation email
            </li>
            <li>
              <span className="step-icon"><FaShieldAlt /></span> Admin will verify your
              payment
            </li>
            <li>
              <span className="step-icon"><FaBoxOpen /></span> We will process your order
              after approval
            </li>
            <li>
              <span className="step-icon"><FaTruck /></span> Track your order using the
              Order ID
            </li>
          </ul>
        </div>

        <div className="placed-actions">
          <button className="btn-primary" type="button" onClick={handleTrackOrder}>
            Track Order →
          </button>
          <button className="btn-secondary" type="button" onClick={handleContinueShopping}>
            <FaShoppingBag /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}