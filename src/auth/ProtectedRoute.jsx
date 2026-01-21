import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

export default function ProtectedRoute({ children }) {
  const { booting, isAuthed } = useAuth();
  if (booting) return <div className="p-6 text-slate-300">Loading...</div>;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
