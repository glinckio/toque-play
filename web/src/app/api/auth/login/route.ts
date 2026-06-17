import { NextResponse } from "next/server";
import { performLogin, isTwoFactorRequired } from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email e senha obrigatórios" },
      { status: 400 },
    );
  }

  try {
    const data = await performLogin(email, password);
    if (isTwoFactorRequired(data)) {
      return NextResponse.json({
        twoFactorRequired: true,
        temporaryToken: data.temporaryToken,
        userId: data.userId,
      });
    }
    return NextResponse.json({ user: data.user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha no login";
    return NextResponse.json({ message }, { status: 401 });
  }
}
