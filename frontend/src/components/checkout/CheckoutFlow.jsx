import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkout from "./checkout";
import Payment from "./payment";
import UploadProof from "./uploadProof";
import OrderPlaced from "./orderPlaced";
import "./CheckoutFlow.css";

// STEP FLOW: "billing" -> "payment" -> "proof" -> "placed"
// Yeh component saare 4 steps ko manage karta hai aur order data
// (billing info, cart items, order id) ko ek jagah rakhta hai
// taake har step ke paas wahi data available ho.

function generateOrderId() {
  const ts = Date.now();
  return `LXE${ts}`;
}

export default function CheckoutFlow({ cartItems = [] }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("billing");
  const [billingData, setBillingData] = useState(null);
  const [orderId] = useState(generateOrderId());

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const handleBillingSubmit = (data) => {
    setBillingData(data);
    setStep("payment");
  };

  const handlePaymentContinue = () => {
    setStep("proof");
  };

  const handleProofSubmitted = () => {
    setStep("placed");
  };

  return (
    <div className="checkout-flow">
      {step === "billing" && (
        <Checkout
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onSubmit={handleBillingSubmit}
        />
      )}

      {step === "payment" && (
        <Payment
          orderId={orderId}
          total={total}
          onContinue={handlePaymentContinue}
          onBack={() => setStep("billing")}
        />
      )}

      {step === "proof" && (
        <UploadProof
          orderId={orderId}
          total={total}
          onSubmitted={handleProofSubmitted}
          onSkip={handleProofSubmitted}
        />
      )}

      {step === "placed" && (
        <OrderPlaced
          orderId={orderId}
          onTrackOrder={() => navigate(`/trackorder?id=${orderId}`)}
          onContinueShopping={() => navigate("/products")}
        />
      )}
    </div>
  );
}