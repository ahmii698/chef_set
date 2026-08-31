import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCheckCircle,
  FaHourglassHalf,
  FaBoxOpen,
  FaTruck,
  FaHome,
} from "react-icons/fa";
import "./trackorder.css";

// Order status ke steps. Abhi static/dummy hain (currentStepIndex = 0
// matlab "pending approval"). Jab backend ready ho, yahan orderId ke
// through API call kar ke actual step index set kar dena.
const STEPS = [
  { key: "placed", label: "Order Placed", icon: FaCheckCircle },
  { key: "approved", label: "Payment Verified", icon: FaCheckCircle },
  { key: "processing", label: "Processing", icon: FaBoxOpen },
  { key: "shipped", label: "Shipped", icon: FaTruck },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [searchedId, setSearchedId] = useState(searchParams.get("id") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearchedId(orderId.trim());
  };

  // TODO: backend integrate hone par is index ko fetched order status se replace karo
  const currentStepIndex = 0;

  return (
    <div className="track-page">
      <div className="track-card">
        <h1>Track Your Order</h1>
        <p className="track-subtitle">
          Enter your Order ID to see its current status
        </p>

        <form className="track-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="e.g. LXE1788204351733"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit">
            <FaSearch /> Track
          </button>
        </form>

        {searchedId && (
          <div className="track-result">
            <div className="track-order-id">
              <span>Order ID:</span>
              <strong>{searchedId}</strong>
            </div>

            <div className="track-steps">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isDone = index <= currentStepIndex;
                return (
                  <div
                    key={step.key}
                    className={`track-step ${isDone ? "done" : ""}`}
                  >
                    <div className="track-step-icon">
                      {isDone ? <Icon /> : <FaHourglassHalf />}
                    </div>
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="track-status-note">
              <FaHourglassHalf />
              <p>
                Your order is pending admin approval. We'll update this
                status once your payment is verified.
              </p>
            </div>
          </div>
        )}

        <button
          className="btn-secondary track-home-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          <FaHome /> Back to Home
        </button>
      </div>
    </div>
  );
}