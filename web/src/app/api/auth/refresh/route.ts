import { NextResponse } from "next/server";
import { performRefresh } from "@/lib/auth/session";

export async function POST() {
  const data = await performRefresh();
  if (!data) {
    return NextResponse.json({ message: "Sessão expirada" }, { status: 401 });
  }
  return NextResponse.json({ user: data.user });
}
