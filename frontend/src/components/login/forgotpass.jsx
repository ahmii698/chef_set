import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./forgotpass.css";

const OTP_LENGTH = 6;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const otpRefs = useRef([]);

  // ---- Step 1: Send OTP ----
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) return;

    console.log("Sending OTP to:", email);
    // API call yahan add karna

    setStep("reset");
  };

  // ---- OTP box handling ----
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // sirf ek digit allow

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      alert("Please enter the complete 6-digit code");
      return;
    }

    console.log("Verifying OTP:", code);
    // API call yahan add karna
  };

  const handleResendCode = () => {
    console.log("Resending OTP to:", email);
    // API call yahan add karna
    setOtp(new Array(OTP_LENGTH).fill(""));
    otpRefs.current[0]?.focus();
  };

  // ---- Update password ----
  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Updating password for:", email);
    // API call yahan add karna — success ke baad login pe redirect

    navigate("/login");
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        {/* Logo */}
        <div className="forgot-logo">
          <h1>
            CHEF<span>SET</span>
          </h1>
          <p className="forgot-tagline">PREMIUM TOOLS FOR EVERY CHEF</p>
        </div>

        {step === "email" ? (
          <>
            {/* Heading */}
            <div className="forgot-heading">
              <h2>Forgot Password?</h2>
              <p>
                No worries! Enter your email address and we'll send you a
                verification code.
              </p>
            </div>

            <div className="forgot-divider">
              <span></span>
            </div>

            {/* Email form */}
            <form className="forgot-form" onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 6h16v12H4V6z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 7l8 6 8-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="forgot-btn">
                SEND OTP
              </button>
            </form>

            <Link to="/login" className="back-link">
              &larr; Back to Login
            </Link>
          </>
        ) : (
          <>
            {/* Heading */}
            <div className="forgot-heading">
              <h2>Verify Your Email</h2>
              <p>
                We have sent a 6-digit verification code to your email
                address.
              </p>
            </div>

            <div className="forgot-divider">
              <span></span>
            </div>

            {/* OTP form */}
            <form className="otp-form" onSubmit={handleVerifyOtp}>
              <label className="otp-label">Enter 6-digit Code</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-box"
                  />
                ))}
              </div>

              <button type="submit" className="forgot-btn">
                VERIFY OTP
              </button>

              <p className="resend-text">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResendCode}
                >
                  Resend Code
                </button>
              </p>
            </form>

            <div className="or-divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>

            {/* Set new password form */}
            <form className="reset-form" onSubmit={handleUpdatePassword}>
              <p className="reset-form-title">Set New Password</p>

              <div className="form-group">
                <label htmlFor="newPassword">Password</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.7 9.7 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.5-2.3 3.7M6.5 6.6C4.5 8 3 9.9 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <svg
                    className="input-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 10V7a4 4 0 0 1 8 0v3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.7 9.7 0 0112 5c5 0 9 4 10 7-.4 1.2-1.2 2.5-2.3 3.7M6.5 6.6C4.5 8 3 9.9 2 12c1 3 5 7 10 7 1.3 0 2.6-.3 3.7-.7"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="forgot-btn">
                UPDATE PASSWORD
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;