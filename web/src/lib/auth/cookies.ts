import { cookies } from "next/headers";
import { COOKIE_ACCESS, COOKIE_REFRESH, COOKIE_USER, COOKIE_MAX_AGE, type SessionUser } from "./constants";

export { COOKIE_ACCESS, COOKIE_REFRESH, COOKIE_USER, COOKIE_MAX_AGE, type SessionUser };

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function isProd() {
  return process.env.NODE_ENV === "production";
}

export function setAuthCookies(
  store: CookieStore,
  payload: { accessToken: string; refreshToken: string; user: SessionUser },
) {
  const common = {
    httpOnly: false as const,
    sameSite: "lax" as const,
    secure: isProd(),
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
  store.set(COOKIE_ACCESS, payload.accessToken, { ...common, httpOnly: true });
  store.set(COOKIE_REFRESH, payload.refreshToken, { ...common, httpOnly: true });
  store.set(COOKIE_USER, JSON.stringify(payload.user), common);
}

export function clearAuthCookies(store: CookieStore) {
  const opts = { path: "/", httpOnly: false as const, sameSite: "lax" as const, secure: isProd() };
  store.set(COOKIE_ACCESS, "", { ...opts, httpOnly: true, maxAge: 0 });
  store.set(COOKIE_REFRESH, "", { ...opts, httpOnly: true, maxAge: 0 });
  store.set(COOKIE_USER, "", { ...opts, maxAge: 0 });
}

export function getAccessToken(store: CookieStore) {
  return store.get(COOKIE_ACCESS)?.value;
}

export function getRefreshToken(store: CookieStore) {
  return store.get(COOKIE_REFRESH)?.value;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_USER)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
