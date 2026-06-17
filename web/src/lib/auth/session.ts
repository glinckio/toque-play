import "server-only";
import { cookies } from "next/headers";
import { COOKIE_ACCESS, getRefreshToken, setAuthCookies, clearAuthCookies, type SessionUser } from "./cookies";

const API = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

export interface TwoFactorRequiredResult {
  twoFactorRequired: true;
  temporaryToken: string;
  userId: string;
}

type LoginResult = AuthResult | TwoFactorRequiredResult;

export function isTwoFactorRequired(r: LoginResult): r is TwoFactorRequiredResult {
  return (r as TwoFactorRequiredResult).twoFactorRequired === true;
}

/** Faz login contra o backend. Se 2FA obrigatório, retorna o ticket temporário
 *  SEM gravar cookies. Caso contrário grava cookies httpOnly. */
export async function performLogin(email: string, password: string): Promise<LoginResult> {
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

  const data = (await res.json()) as LoginResult;
  if (isTwoFactorRequired(data)) {
    return data;
  }
  const store = await cookies();
  setAuthCookies(store, data);
  return data;
}

/** Completar login 2FA: valida temporaryToken + code contra o backend e,
 *  em sucesso, grava cookies httpOnly. */
export async function performVerify2fa(
  temporaryToken: string,
  code: string,
): Promise<AuthResult> {
  const res = await fetch(`${API}/auth/verify-2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temporaryToken, code }),
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
