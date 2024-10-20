import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("jwtToken");

  // If no token, redirect to the login page
  if (!token) {
    console.log("No token found");
    return <Navigate to="/login" replace />;
  }

  // If token exists, allow access to the children components
  return <Outlet />;
};

export default ProtectedRoute;
