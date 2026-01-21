import React from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../auth/useAuth";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-xl text-sm font-medium transition",
          isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900 hover:text-white",
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
      <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Link to="/feed" className="font-extrabold tracking-tight text-lg">
            Ascend
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/feed">Hope Feed</NavItem>
            <NavItem to="/circles">Circles</NavItem>
            <NavItem to="/challenges">Challenges</NavItem>
            <NavItem to="/leaderboard">Leaderboard</NavItem>
            {isAuthed && <NavItem to="/profile">Profile</NavItem>}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
            >
              Menu
            </button>
            {isAuthed ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-300">
                  @{user?.username}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900" to="/login">
                  Login
                </Link>
                <Link className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-800/60">
            <div className="mx-auto max-w-6xl px-4 py-3 grid gap-2">
              <NavItem to="/feed">Hope Feed</NavItem>
              <NavItem to="/circles">Circles</NavItem>
              <NavItem to="/challenges">Challenges</NavItem>
              <NavItem to="/leaderboard">Leaderboard</NavItem>
              {isAuthed && <NavItem to="/profile">Profile</NavItem>}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-400">
          Built with Django + React • Ascend MVP
        </div>
      </footer>
    </div>
  );
}
