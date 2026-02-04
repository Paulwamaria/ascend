import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function StaffRoute({ children }) {
  const { booting, isAuthed, user } = useAuth();

  if (booting) return <div className="text-slate-300 p-4">Loading...</div>;
  if (!isAuthed) return <Navigate to="/login" replace />;

  const isStaff = !!user?.is_staff;
  if (!isStaff) return <Navigate to="/feed" replace />;

  return children;
}
