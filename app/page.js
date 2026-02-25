import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/lib/authStore";

export default async function RootPage() {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore);

  if (session) {
    redirect("/dashboard/resumo");
  }

  redirect("/login");
}
