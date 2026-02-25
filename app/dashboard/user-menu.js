"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingProgressBar from "@/app/components/loading-progress-bar";

export default function UserMenu({ username }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
      >
        <UserRound className="h-4 w-4 text-sky-300" />
        {username}
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-44 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-xl shadow-black/30">
          <LoadingProgressBar active={loggingOut} className="mb-2" />

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      ) : null}
    </div>
  );
}
