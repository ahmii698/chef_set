import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ChevronDown, UserPlus } from "lucide-react";
import "./create_account.css";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // TODO: apna API call yahan lagao
      // const res = await axios.post("/api/admin/create-account", formData);
      console.log("Submitting:", formData);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-page">
      <div className="create-account-card">
        <div className="brand-section">
          <h1 className="brand-title">
            CHEF<span className="brand-highlight">SET</span>
          </h1>
          <div className="brand-subtitle-wrapper">
            <span className="brand-line"></span>
            <p className="brand-subtitle">ADMIN PANEL</p>
            <span className="brand-line"></span>
          </div>
        </div>

        <h2 className="form-title">Create Admin Account</h2>
        <p className="form-description">Fill in the details to create a new admin</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
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
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
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

         

          <button type="submit" className="create-account-btn" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="login-redirect">
          Already have an account? <a href="/admin/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;