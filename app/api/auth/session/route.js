import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/authStore";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const session = getSessionFromCookie(cookieStore);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      nome: session.nome,
    },
  });
}