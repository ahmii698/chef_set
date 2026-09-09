// src/components/checkout/CheckoutFlow.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/authService";
import { API_URL } from "../../../config";
import Checkout from "./checkout";
import Payment from "./payment";
import UploadProof from "./uploadProof";
import OrderPlaced from "./orderPlaced";
import "./CheckoutFlow.css";

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LXE';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CheckoutFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("billing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [billingData, setBillingData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [actualOrderId, setActualOrderId] = useState(null);
  const [tempOrderId] = useState(generateOrderId());

  const cartItems = location.state?.cartItems || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate('/products');
    }
  }, [cartItems, loading, navigate]);

  // ===== BILLING SUBMIT =====
  const handleBillingSubmit = async (billingData) => {
    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        ...billingData,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image || ""
        })),
        subtotal,
        shipping,
        total,
        orderId: tempOrderId
      };

      console.log('📦 Creating order with payload:', orderPayload);
      console.log('📦 Temp Order ID being sent:', tempOrderId);

      // ✅ GET TOKEN from authService
      const token = getToken();
      console.log('🔑 Token being sent:', token ? 'Yes' : 'No');

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      console.log('📥 Order API Response:', data);

      if (response.ok) {
        console.log('✅ Order created successfully!');
        console.log('✅ Order ID from response:', data.order?.orderId);
        console.log('✅ Full order data:', data.order);
        
        setBillingData(billingData);
        setOrderData(data.order);
        setActualOrderId(data.order?.orderId);
        
        // Clear cart
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        setStep("payment");
      } else {
        console.log('❌ Order creation failed:', data);
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===== PAYMENT CONTINUE =====
  const handlePaymentContinue = () => {
    console.log('➡️ Moving to proof step with orderId:', actualOrderId);
    setStep("proof");
  };

  // ===== PROOF SUBMITTED =====
  const handleProofSubmitted = () => {
    console.log('✅ Proof submitted, moving to placed step');
    setStep("placed");
  };

  // ===== BACK TO BILLING =====
  const handleBackToBilling = () => {
    console.log('⬅️ Going back to billing step');
    setStep("billing");
  };

  const orderIdForUpload = actualOrderId || tempOrderId;

  return (
    <div className="checkout-flow">
      {error && <div className="flow-error">{error}</div>}

      {step === "billing" && (
        <Checkout
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onSubmit={handleBillingSubmit}
          loading={loading}
          error={error}
        />
      )}

      {step === "payment" && (
        <Payment
          orderId={orderIdForUpload}
          total={total}
          onContinue={handlePaymentContinue}
          onBack={handleBackToBilling}
          orderData={orderData}
        />
      )}

      {step === "proof" && (
        <UploadProof
          orderId={orderIdForUpload}
          total={total}
          onSubmitted={handleProofSubmitted}
          onSkip={handleProofSubmitted}
          orderData={orderData}
        />
      )}

      {step === "placed" && (
        <OrderPlaced
          orderId={orderIdForUpload}
          onTrackOrder={() => navigate(`/trackorder?order=${orderIdForUpload}`)}
          onContinueShopping={() => navigate("/products")}
          orderData={orderData}
        />
      )}
    </div>
  );
}