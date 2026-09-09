// src/components/checkout/trackorder.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCheckCircle,
  FaHourglassHalf,
  FaBoxOpen,
  FaTruck,
  FaHome,
  FaExclamationTriangle,
} from "react-icons/fa";
import { API_URL } from "../../../config";
import "./trackorder.css";

// Order status ke steps
const STEPS = [
  { key: "placed", label: "Order Placed", icon: FaCheckCircle },
  { key: "approved", label: "Payment Verified", icon: FaCheckCircle },
  { key: "processing", label: "Processing", icon: FaBoxOpen },
  { key: "shipped", label: "Shipped", icon: FaTruck },
];

// Status to step index mapping
const STATUS_TO_INDEX = {
  pending: 0,
  processing: 2,
  shipped: 3,
  delivered: 3,
  cancelled: 0,
};

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [searchedId, setSearchedId] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto search if orderId in URL
  useEffect(() => {
    if (searchedId) {
      fetchOrder(searchedId);
    }
  }, []);

  const fetchOrder = async (id) => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(`${API_URL}/orders/${id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        setError(data.message || "Order not found");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    const id = orderId.trim();
    setSearchedId(id);
    fetchOrder(id);
  };

  const getStepIndex = (status) => {
    return STATUS_TO_INDEX[status] || 0;
  };

  const getStatusMessage = (status) => {
    const messages = {
      pending: "Your order is pending admin approval. We'll update this status once your payment is verified.",
      processing: "Your order is being processed and prepared for shipment.",
      shipped: "Your order has been shipped and is on its way to you!",
      delivered: "Your order has been delivered. Thank you for shopping with us!",
      cancelled: "Your order has been cancelled. Please contact support for more information."
    };
    return messages[status] || messages.pending;
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

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
          <button type="submit" disabled={loading}>
            <FaSearch /> {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="track-error">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {searchedId && !error && (
          <div className="track-result">
            <div className="track-order-id">
              <span>Order ID:</span>
              <strong>{searchedId}</strong>
            </div>

            {order && (
              <div className="track-order-info">
                <div className="track-order-meta">
                  <span><strong>Status:</strong> {order.status?.toUpperCase()}</span>
                  <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span><strong>Total:</strong> Rs. {order.total?.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="track-steps">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isDone = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div
                    key={step.key}
                    className={`track-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    <div className="track-step-icon">
                      {isDone ? <Icon /> : <FaHourglassHalf />}
                    </div>
                    <span>{step.label}</span>
                    {isCurrent && <span className="track-step-badge">Current</span>}
                  </div>
                );
              })}
            </div>

            <div className="track-status-note">
              <FaHourglassHalf />
              <p>{order ? getStatusMessage(order.status) : "Loading order status..."}</p>
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