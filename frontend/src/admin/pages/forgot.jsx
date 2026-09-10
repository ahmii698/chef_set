// src/admin/pages/forgot.jsx
import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChefHat, ArrowLeft } from "lucide-react";
import { adminForgotPassword, adminVerifyOTP, adminResetPassword } from "../services/adminAuthService";
import "./forgot.css";

const Forgot = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const otpRefs = useRef([]);

  // ===== SEND OTP =====
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const result = await adminForgotPassword(email);
      setMessage(result.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.message || "Admin not found with this email");
    } finally {
      setLoading(false);
    }
  };

  // ===== OTP HANDLING =====
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ===== VERIFY OTP =====
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const result = await adminVerifyOTP(email, code);
      setMessage(result.message || "OTP verified successfully");
    } catch (err) {
      setError(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  // ===== RESEND OTP =====
  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await adminForgotPassword(email);
      setMessage(result.message || "Code resent to your email");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // ===== UPDATE PASSWORD =====
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please verify the OTP first");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await adminResetPassword(email, newPassword);
      setMessage(result.message || "Password updated successfully");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="brand-section">
          <div className="brand-icon">
            <ChefHat size={32} strokeWidth={1.8} />
          </div>
          <h1 className="brand-title">
            CHEF<span className="brand-highlight">SET</span>
          </h1>
          <p className="brand-tagline">PREMIUM TOOLS FOR EVERY CHEF</p>
        </div>

        {step === 1 && (
          <>
            <h2 className="form-title">Forgot Password?</h2>
            <p className="form-description">
              No worries! Enter your email address and we'll send you a verification code.
            </p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSendOtp} className="forgot-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Sending..." : "SEND OTP"}
              </button>
            </form>

            <Link to="/admin/login" className="back-link">
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="form-title">Verify Your Email</h2>
            <p className="form-description">
              We have sent a 6-digit verification code to your email address.
            </p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <div className="form-group">
              <label>Enter 6-digit Code</label>
              <div className="otp-wrapper">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-box"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "VERIFY OTP"}
            </button>

            <p className="resend-text">
              Didn't receive the code?{" "}
              <button type="button" className="resend-link" onClick={handleResendCode}>
                Resend Code
              </button>
            </p>

            <div className="or-divider">
              <span></span>
              OR
              <span></span>
            </div>

            <h3 className="section-title">Set New Password</h3>

            <form onSubmit={handleUpdatePassword} className="forgot-form">
              <div className="form-group">
                <label htmlFor="newPassword">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Updating..." : "UPDATE PASSWORD"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Forgot;