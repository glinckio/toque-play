import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ACCESS, COOKIE_USER } from "@/lib/auth/constants";

const PUBLIC_PATHS = ["/login"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const access = req.cookies.get(COOKIE_ACCESS)?.value;
  const userRaw = req.cookies.get(COOKIE_USER)?.value;

  if (!access || !userRaw) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Acesso restrito a SUPER_ADMIN/ADMIN
  try {
    const user = JSON.parse(userRaw) as { role?: string };
    if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "?error=forbidden";
      return NextResponse.redirect(url);
    }
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|fonts|.*\\..*).*)"],
};
