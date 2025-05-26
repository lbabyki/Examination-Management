import React from "react";
import { Navigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";

export default function RequireRole({ role: requiredRole, children }) {
  const role = useUserRole();

  if (role === undefined) return null; // loading
  if (role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}
