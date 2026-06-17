import { NextResponse } from "next/server";
import { performVerify2fa } from "@/lib/auth/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const temporaryToken = String(body.temporaryToken ?? "");
  const code = String(body.code ?? "").trim();

  if (!temporaryToken || !code) {
    return NextResponse.json(
      { message: "Token temporário e código são obrigatórios" },
      { status: 400 },
    );
  }

  try {
    const data = await performVerify2fa(temporaryToken, code);
    return NextResponse.json({ user: data.user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Código inválido";
    return NextResponse.json({ message }, { status: 401 });
  }
}
