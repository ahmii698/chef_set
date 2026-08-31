import React, { useState } from "react";
import {
  FaCreditCard,
  FaUniversity,
  FaQrcode,
  FaMobileAlt,
  FaCopy,
  FaCheck,
  FaClipboardList,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "./payment.css";

const BANK_DETAILS = {
  bankName: "Bank Alfalah Limited",
  accountTitle: "Chefset (PVT) LTD",
  accountNumber: "PK36 ALFH 0001 2345 6789",
  iban: "PK36ALFH0000123456789",
  swiftCode: "ALFHPKKA",
};

const TABS = [
  { id: "bank", label: "Bank Transfer", icon: FaUniversity },
  { id: "qr", label: "Scan QR", icon: FaQrcode },
  { id: "mobile", label: "Mobile Banking", icon: FaMobileAlt },
];

export default function Payment({ orderId, total = 0, onContinue, onBack }) {
  const [activeTab, setActiveTab] = useState("bank");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(BANK_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <div className="payment-header">
          <FaCreditCard className="payment-icon" />
          <h1>Complete Payment</h1>
          <p>Choose your preferred payment method</p>
        </div>

        <div className="order-ref-box">
          <span className="label">Order Reference</span>
          <span className="value">{orderId}</span>
        </div>

        <div className="payment-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`payment-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <Icon className="tab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="amount-box">
          <span className="label">Total Amount To Pay</span>
          <span className="amount">Rs. {total.toLocaleString()}</span>
        </div>

        {activeTab === "bank" && (
          <div className="bank-details">
            <h3>Bank Account Details</h3>
            <div className="detail-row">
              <span className="detail-label">Bank Name:</span>
              <span className="detail-value">{BANK_DETAILS.bankName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Title:</span>
              <span className="detail-value">{BANK_DETAILS.accountTitle}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Account Number:</span>
              <span className="detail-value gold">
                {BANK_DETAILS.accountNumber}
              </span>
              <button className="copy-btn" onClick={handleCopy} type="button">
                {copied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <div className="detail-row">
              <span className="detail-label">IBAN:</span>
              <span className="detail-value">{BANK_DETAILS.iban}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">SWIFT Code:</span>
              <span className="detail-value">{BANK_DETAILS.swiftCode}</span>
            </div>
          </div>
        )}

        {activeTab === "qr" && (
          <div className="bank-details qr-placeholder">
            <p>Scan the QR code in your banking app to pay Rs. {total.toLocaleString()}.</p>
          </div>
        )}

        {activeTab === "mobile" && (
          <div className="bank-details">
            <h3>Mobile Banking</h3>
            <div className="detail-row">
              <span className="detail-label">Easypaisa / JazzCash:</span>
              <span className="detail-value gold">0300-1234567</span>
            </div>
          </div>
        )}

        <div className="instructions-box">
          <h4>
            <FaClipboardList className="instructions-icon" /> Instructions:
          </h4>
          <ul>
            <li>Use your full name as reference when transferring</li>
            <li>Keep transaction ID for proof</li>
            <li>Amount must match exactly: Rs. {total.toLocaleString()}</li>
          </ul>
        </div>

        <div className="payment-actions">
          <button className="btn-secondary" type="button" onClick={onBack}>
            <FaArrowLeft /> Back
          </button>
          <button className="btn-primary" type="button" onClick={onContinue}>
            I've Made the Payment <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}