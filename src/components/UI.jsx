import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/40 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="p-5 border-b border-slate-800/60 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl bg-slate-950/40 border border-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl bg-slate-950/40 border border-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
      {...props}
    />
  );
}

export function Button({ className = "", variant = "primary", ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 hover:bg-indigo-500 text-white"
      : variant === "ghost"
      ? "bg-transparent hover:bg-slate-800 text-slate-100"
      : "bg-slate-800 hover:bg-slate-700 text-slate-100";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}
