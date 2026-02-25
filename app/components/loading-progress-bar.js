"use client";

export default function LoadingProgressBar({ active, className = "" }) {
  if (!active) {
    return null;
  }

  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div className="loading-progress-bar h-full w-2/5 rounded-full bg-sky-600" />
    </div>
  );
}
