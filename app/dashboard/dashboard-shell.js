"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  PanelLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import UserMenu from "./user-menu";

const menu = [
  { href: "/dashboard/resumo", label: "Resumo", icon: BarChart3 },
  { href: "/dashboard/empreendimentos", label: "Empreendimentos", icon: Building2 },
];

export default function DashboardShell({ today, username, nome, children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("dashboard_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    window.localStorage.setItem("dashboard_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
        <aside
          className={`hidden border-r border-slate-800 bg-slate-950 transition-[width,padding] duration-300 ease-in-out md:block ${
            collapsed ? "w-[86px] p-2" : "w-[280px] p-3"
          }`}
        >
          <div className={`rounded-xl border border-slate-700 bg-slate-900 ${collapsed ? "p-2" : "p-3"}`}>
            <div className={`relative flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-2`}>
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-slate-950">
                  GE
                </div>

                <div
                  className={`min-w-0 overflow-hidden transition-all duration-300 ${
                    collapsed ? "max-w-0 opacity-0 -translate-x-2" : "max-w-[170px] opacity-100 translate-x-0"
                  }`}
                >
                  <p className="truncate text-xs uppercase tracking-widest text-sky-300">Painel</p>
                  <h1 className="truncate text-sm font-semibold text-white">Empreendimentos</h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCollapsed((prev) => !prev)}
                className={`rounded-md border border-slate-600 bg-slate-950 p-1 text-slate-300 transition hover:bg-slate-800 ${
                  collapsed ? "absolute -right-1 -top-1" : ""
                }`}
                aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              >
                <PanelLeft
                  className={`h-4 w-4 transition-transform duration-300 ${
                    collapsed ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            <p
              className={`mt-2 overflow-hidden text-sm text-slate-300 transition-all duration-300 ${
                collapsed ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
              }`}
            >
              Olá, {nome}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm transition-all ${
                    collapsed ? "justify-center" : "gap-2"
                  } ${
                    active
                      ? "bg-sky-500/20 text-sky-200 ring-1 ring-sky-500/40"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                  title={item.label}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-sky-300" : ""}`} />
                  <span
                    className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                      collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1">
          <header className="border-b border-slate-800 bg-slate-900 px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-200">
                <CalendarDays className="h-5 w-5 text-sky-300" />
                <p className="text-sm font-medium">Hoje, {today}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="rounded-md border border-slate-700 bg-slate-950 p-2 text-slate-300"
                  aria-label="Notificações"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <UserMenu username={username} />
              </div>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                      active
                          ? "border-sky-500/40 bg-sky-500/20 text-sky-200"
                          : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <div className="p-4 md:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
