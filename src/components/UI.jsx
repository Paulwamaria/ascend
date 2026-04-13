import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-md backdrop-blur-sm",
        "transition duration-200",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-800/70 p-5 sm:p-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-2xl text-sm text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-sm text-slate-100",
        "placeholder:text-slate-500",
        "outline-none transition duration-200",
        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={[
        "w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-100",
        "placeholder:text-slate-500",
        "outline-none transition duration-200",
        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Button({ className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg"
      : variant === "ghost"
      ? "bg-transparent text-slate-100 hover:bg-slate-800/80"
      : "border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

export function Badge({ children, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-200",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}