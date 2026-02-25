import { NextResponse } from "next/server";

const SESSION_COOKIE = "empre_session";

export function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isLoginPath = pathname.startsWith("/login") || pathname.startsWith("/api/auth");

  if (!token && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isLoginPath && pathname === "/login") {
    const dashboardUrl = new URL("/dashboard/resumo", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (!token && pathname.startsWith("/api/empreendimentos")) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/api/empreendimentos/:path*"],
};