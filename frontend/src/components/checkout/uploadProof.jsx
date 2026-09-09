// src/components/checkout/uploadProof.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";
import "./uploadProof.css";

const MAX_SIZE_MB = 5;

export default function UploadProof({ orderId, total = 0, onSubmitted, onSkip, orderData = null }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validateAndSetFile = (selected) => {
    if (!selected) return;
    const isImage = ["image/png", "image/jpeg"].includes(selected.type);
    const isUnderLimit = selected.size <= MAX_SIZE_MB * 1024 * 1024;

    if (!isImage) {
      setError("Only PNG or JPG files are allowed");
      return;
    }
    if (!isUnderLimit) {
      setError(`File must be under ${MAX_SIZE_MB}MB`);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload your payment screenshot");
      return;
    }

    // ✅ CHECK: orderId exists?
    if (!orderId) {
      setError("Order ID is missing. Please go back and try again.");
      return;
    }

    console.log('📤 Uploading proof for orderId:', orderId);
    console.log('📤 API URL:', `${API_URL}/orders/upload-proof/${orderId}`);
    console.log('📤 File name:', file.name);
    console.log('📤 File size:', file.size);
    console.log('📤 Order data:', orderData);

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("proof", file);

      // ✅ REMOVED: formData.append("orderId", orderId) - already in URL

      // Upload proof image
      const uploadResponse = await fetch(`${API_URL}/orders/upload-proof/${orderId}`, {
        method: 'POST',
        body: formData,
        // ✅ NO Content-Type header - browser sets it with boundary
      });

      console.log('📥 Upload response status:', uploadResponse.status);
      const uploadData = await uploadResponse.json();
      console.log('📥 Upload response data:', uploadData);

      if (uploadResponse.ok) {
        console.log('✅ Proof uploaded successfully!');
        setSuccess("Payment proof uploaded successfully! ✅");
        setTimeout(() => {
          onSubmitted && onSubmitted();
        }, 1000);
      } else {
        console.log('❌ Upload failed:', uploadData);
        setError(uploadData.message || "Failed to upload proof");
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    console.log('⏭️ Skipping proof upload for order:', orderId);
    if (onSkip) {
      onSkip();
    } else {
      navigate(`/trackorder?order=${orderId}`);
    }
  };

  return (
    <div className="proof-page">
      <div className="proof-card">
        <div className="proof-header">
          <span className="proof-icon">🧾</span>
          <h1>Upload Payment Proof</h1>
          <p>Please upload a screenshot of your payment confirmation</p>
        </div>

        <div className="order-id-box">
          <span className="label">Order ID</span>
          <span className="value">{orderId || 'Loading...'}</span>
          <span className="hint">Use this Order ID to track your order</span>
        </div>

        <div className="important-box">
          <h4>🛡 Important Instructions</h4>
          <ul>
            <li>Upload clear screenshot of payment confirmation</li>
            <li>Screenshot should show transaction ID and amount</li>
            <li>File format: JPG, PNG — max {MAX_SIZE_MB}MB</li>
            <li>Make sure the amount matches Rs. {total.toLocaleString()}</li>
          </ul>
        </div>

        <label className="field-label">Payment Screenshot *</label>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div
          className={`dropzone ${dragActive ? "active" : ""} ${file ? "has-file" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            hidden
            onChange={(e) => validateAndSetFile(e.target.files[0])}
          />
          <span className="dropzone-icon">🖼</span>
          {file ? (
            <>
              <p className="dropzone-text">{file.name}</p>
              <span className="dropzone-hint">Click to change file</span>
            </>
          ) : (
            <>
              <p className="dropzone-text">Click or drag to upload screenshot</p>
              <span className="dropzone-hint">PNG, JPG up to {MAX_SIZE_MB}MB</span>
            </>
          )}
        </div>

        <button
          className="btn-primary"
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Uploading..." : "Submit Proof →"}
        </button>

        <button className="skip-link" type="button" onClick={handleSkip}>
          Skip for now? Track your order later
        </button>

        <p className="support-text">
          Need help? <a href="/contact">Contact our support team</a>
        </p>
      </div>
    </div>
  );
}