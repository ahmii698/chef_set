// src/admin/pages/login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email aur password dono zaroori hain.");
      return;
    }

    // TODO: yahan apna real API call lagana (login validate karne ke liye)
    localStorage.setItem("adminToken", "true");
    if (rememberMe) {
      localStorage.setItem("adminEmail", email);
    }

    navigate("/admin/dashboard");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-topbar">ADMIN LOGIN PAGE</div>

      <div className="admin-login-card">
        {/* Logo */}
        <div className="login-logo">
          <h1 className="login-logo-text">
            CHEF<span>SET</span>
          </h1>
          <p className="login-logo-subtitle">ADMIN PANEL</p>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome Back!</h2>
          <p>Sign in to access the admin panel</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/admin/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn">
            LOGIN
          </button>
        </form>

        {/* Create Account link */}
        <p className="create-account-text">
          Don't have an account?{" "}
          <Link to="/admin/create-account" className="create-account-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;