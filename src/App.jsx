import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";

import StaffRoute from "./auth/StaffRoute";
import StaffChallenges from "./pages/StaffChallenges";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Circles from "./pages/Circles";
import CircleDetail from "./pages/CircleDetail";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/LeaderBoard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/circles/:id" element={<CircleDetail />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/challenges"
          element={
            <StaffRoute>
              <StaffChallenges />
            </StaffRoute>
          }
        />

        <Route path="*" element={<div className="text-slate-300">Not found</div>} />
      </Routes>
    </Layout>
  );
}
