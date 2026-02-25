import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/lib/authStore";
import DashboardShell from "./dashboard-shell";

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
    <DashboardShell
      today={today}
      username={session.username}
      nome={session.nome}
    >
      {children}
    </DashboardShell>
  );
}
