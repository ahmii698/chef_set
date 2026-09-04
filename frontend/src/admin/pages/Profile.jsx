// src/admin/pages/Profile.jsx
import React, { useState } from "react";
import { User, Mail, Phone, Camera, Save } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./profile.css";

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "Admin",
    email: "admin@chefset.com",
    phone: "+92 300 1234567",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="profile-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="profile-content">
          <div className="profile-header">
            <h1 className="profile-title">Edit Profile</h1>
            <p className="profile-breadcrumb">Dashboard / Profile</p>
          </div>

          <div className="profile-card">
            {/* Profile Image */}
            <div className="profile-image-section">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <button className="change-photo-btn">
                <Camera size={16} />
                Change Photo
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>
                  <User size={16} />
                  FULL NAME
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={16} />
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={16} />
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <button type="submit" className="save-btn">
                <Save size={16} />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;