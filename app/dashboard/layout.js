import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BarChart3, Bell, Building2, CalendarDays } from "lucide-react";
import { getSessionFromCookie } from "@/lib/authStore";
import UserMenu from "./user-menu";

const menu = [
  { href: "/dashboard/resumo", label: "Resumo", icon: BarChart3 },
  { href: "/dashboard/empreendimentos", label: "Empreendimentos", icon: Building2 },
];

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore);
  const today = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date());

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-4 md:block">
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-xs uppercase tracking-widest text-sky-700">Painel</p>
            <h1 className="mt-1 text-lg font-semibold text-sky-900">Empreendimentos</h1>
            <p className="mt-2 text-sm text-slate-600">Olá, {session.nome}</p>
          </div>

          <nav className="mt-6 space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <Icon className="h-4 w-4 text-sky-700" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1">
          <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-700">
                <CalendarDays className="h-5 w-5 text-sky-700" />
                <p className="text-sm font-medium">Hoje, {today}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 bg-white p-2 text-slate-600"
                  aria-label="Notificações"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <UserMenu username={session.username} />
              </div>
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex shrink-0 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    <Icon className="h-4 w-4 text-sky-700" />
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
