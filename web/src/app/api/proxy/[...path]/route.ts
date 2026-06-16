import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  COOKIE_ACCESS,
  COOKIE_REFRESH,
  COOKIE_USER,
  setAuthCookies,
  clearAuthCookies,
  type SessionUser,
} from "@/lib/auth/cookies";

const API = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api";

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function callBackend(
  path: string,
  search: string,
  method: Method,
  init: RequestInit,
  accessToken: string,
) {
  const url = `${API}/${path}${search ? `?${search}` : ""}`;
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  if (bodyShouldHaveJson(headers, init.body)) {
    headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  }

  return fetch(url, {
    method,
    headers,
    body: init.body,
    cache: "no-store",
    next: { revalidate: 0 },
  });
}

function bodyShouldHaveJson(headers: Headers, body: BodyInit | null | undefined) {
  if (!body) return false;
  return !headers.has("Content-Type");
}

async function tryRefresh(): Promise<string | null> {
  const store = await cookies();
  const refresh = store.get(COOKIE_REFRESH)?.value;
  if (!refresh) return null;

  const res = await fetch(`${API}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refresh }),
    cache: "no-store",
  });
  if (!res.ok) {
    clearAuthCookies(store);
    return null;
  }
  const data = (await res.json()) as { accessToken: string; refreshToken: string; user: SessionUser };
  setAuthCookies(store, data);
  return data.accessToken;
}

async function proxy(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: rawPath } = await ctx.params;
  const path = rawPath.join("/");
  const search = new URL(req.url).search.replace(/^\?/, "");
  const method = req.method as Method;

  const store = await cookies();
  let access: string | undefined = store.get(COOKIE_ACCESS)?.value ?? undefined;

  if (!access) {
    access = (await tryRefresh()) ?? undefined;
    if (!access) {
      return NextResponse.json({ message: "Sessão expirada" }, { status: 401 });
    }
  }

  const body = method !== "GET" && method !== "DELETE" ? await req.text() : null;
  let res = await callBackend(path, search, method, { body, headers: req.headers }, access);

  if (res.status === 401) {
    const newAccess = (await tryRefresh()) ?? undefined;
    if (newAccess) {
      res = await callBackend(path, search, method, { body, headers: req.headers }, newAccess);
    }
  }

  const contentType = res.headers.get("content-type") ?? "application/json";
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": contentType },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
