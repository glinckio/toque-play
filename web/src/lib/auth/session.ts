import "server-only";
import { cookies } from "next/headers";
import { COOKIE_ACCESS, getRefreshToken, setAuthCookies, clearAuthCookies, type SessionUser } from "./cookies";

const API = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

/** Faz login contra o backend e grava cookies httpOnly. */
export async function performLogin(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const msg = await safeError(res);
    throw new Error(msg);
  }

  const data = (await res.json()) as AuthResult;
  const store = await cookies();
  setAuthCookies(store, data);
  return data;
}

/** Renova access token usando o refresh cookie. Retorna novo access ou null. */
export async function performRefresh(): Promise<AuthResult | null> {
  const store = await cookies();
  const refresh = getRefreshToken(store);
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

  const data = (await res.json()) as AuthResult;
  setAuthCookies(store, data);
  return data;
}

export async function performLogout(): Promise<void> {
  const store = await cookies();
  const access = store.get(COOKIE_ACCESS)?.value;
  if (access) {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    }).catch(() => undefined);
  }
  clearAuthCookies(store);
}

async function safeError(res: Response): Promise<string> {
  try {
    const body = await res.clone().json();
    return body?.message ?? `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}
