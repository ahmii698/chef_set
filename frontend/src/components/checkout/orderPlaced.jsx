import React from "react";
import {
  FaHourglassHalf,
  FaEnvelope,
  FaShieldAlt,
  FaBoxOpen,
  FaTruck,
  FaShoppingBag,
} from "react-icons/fa";
import "./orderPlaced.css";

export default function OrderPlaced({ orderId, onTrackOrder, onContinueShopping }) {
  return (
    <div className="placed-page">
      <div className="placed-card">
        <div className="placed-icon">
          <FaHourglassHalf />
        </div>
        <h1>Order Placed!</h1>

        <div className="order-id-pill">
          <span>Order ID:</span>
          <strong>{orderId}</strong>
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
          <button className="btn-primary" type="button" onClick={onTrackOrder}>
            Track Order →
          </button>
          <button className="btn-secondary" type="button" onClick={onContinueShopping}>
            <FaShoppingBag /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}