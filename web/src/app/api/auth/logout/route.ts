import { NextResponse } from "next/server";
import { performLogout } from "@/lib/auth/session";

export async function POST() {
  await performLogout();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  await performLogout();
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001"));
}
