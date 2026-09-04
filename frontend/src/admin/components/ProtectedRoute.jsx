// src/admin/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Login hote waqt AdminLogin.jsx mein yeh set hota hai:
// localStorage.setItem("adminToken", "true");
//
// Logout button pe yeh call karna hai:
// localStorage.removeItem("adminToken");

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("adminToken");

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;