// src/admin/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAdminToken, adminVerifyToken, adminLogout } from "../services/adminAuthService";

// Login hote waqt AdminLogin.jsx mein yeh set hota hai:
// localStorage.setItem("adminToken", token);
//
// Logout button pe yeh call karna hai:
// adminLogout(); // localStorage.removeItem("adminToken");

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(null); // null = loading, true = verified, false = not
  const token = getAdminToken();

  useEffect(() => {
    const verifyAdmin = async () => {
      // Agar token nahi hai toh redirect
      if (!token) {
        setIsVerified(false);
        return;
      }

      try {
        // ✅ Backend se token verify karo
        await adminVerifyToken();
        setIsVerified(true);
      } catch (error) {
        console.error('❌ Admin token invalid:', error);
        adminLogout();
        setIsVerified(false);
      }
    };

    verifyAdmin();
  }, [token]);

  // ✅ Loading state
  if (isVerified === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#e8a33c',
        fontSize: '1.2rem'
      }}>
        Verifying admin access...
      </div>
    );
  }

  // ✅ Not verified - redirect to login
  if (!isVerified) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Verified - show children
  return children;
};

export default ProtectedRoute;