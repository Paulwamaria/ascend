import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition duration-200",
          isActive
            ? "bg-slate-800 text-white shadow-sm"
            : "text-slate-300 hover:bg-slate-900 hover:text-white",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { isAuthed, user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/feed" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md">
              A
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-extrabold tracking-tight text-white">
                Ascend
              </div>
              <div className="text-xs text-slate-400">
                Connect • Grow • Rise
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            <NavItem to="/feed">Hope Feed</NavItem>
            <NavItem to="/circles">Circles</NavItem>
            <NavItem to="/challenges">Challenges</NavItem>
            <NavItem to="/leaderboard">Leaderboard</NavItem>
            {isAuthed && <NavItem to="/profile">Profile</NavItem>}
            {user?.is_staff && <NavItem to="/staff/challenges">Staff</NavItem>}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 md:hidden"
            >
              Menu
            </button>

            {isAuthed ? (
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  @{user?.username}
                </div>

                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-900"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="border-t border-slate-800/70 md:hidden">
            <div className="mx-auto grid max-w-6xl gap-2 px-4 py-4 sm:px-6">
              <NavItem to="/feed" onClick={() => setOpen(false)}>
                Hope Feed
              </NavItem>
              <NavItem to="/circles" onClick={() => setOpen(false)}>
                Circles
              </NavItem>
              <NavItem to="/challenges" onClick={() => setOpen(false)}>
                Challenges
              </NavItem>
              <NavItem to="/leaderboard" onClick={() => setOpen(false)}>
                Leaderboard
              </NavItem>
              {isAuthed && (
                <NavItem to="/profile" onClick={() => setOpen(false)}>
                  Profile
                </NavItem>
              )}
              {user?.is_staff && (
                <NavItem to="/staff/challenges" onClick={() => setOpen(false)}>
                  Staff
                </NavItem>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/70">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-400 sm:px-6 lg:px-8">
          Built with Django + React • Ascend MVP
        </div>
      </footer>
    </div>
  );
}