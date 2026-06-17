import "server-only";
import { cookies } from "next/headers";
import { COOKIE_ACCESS, getRefreshToken, setAuthCookies } from "./cookies";
import { performRefresh } from "./session";

const API = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api";

export interface ConsentsState {
  version: string;
  lastAcceptedAt: string | null;
  lastAcceptedVersion: string | null;
  termsOutdated: boolean;
  consents: {
    terms: boolean;
    notificationsPush: boolean;
    locationDiscovery: boolean;
    marketingEmail: boolean;
  };
}

/**
 * Fetches the user's consent state from the backend. Tries an access token
 * refresh once on 401. Returns null if the user is not authenticated.
 */
export async function getConsentsState(): Promise<ConsentsState | null> {
  const store = await cookies();
  let access = store.get(COOKIE_ACCESS)?.value;

  let res = await fetch(`${API}/me/consents`, {
    headers: access ? { Authorization: `Bearer ${access}` } : {},
    cache: "no-store",
  });

  if (res.status === 401) {
    const refreshed = await performRefresh();
    if (refreshed) {
      access = refreshed.accessToken;
      res = await fetch(`${API}/me/consents`, {
        headers: { Authorization: `Bearer ${access}` },
        cache: "no-store",
      });
    }
  }

  if (!res.ok) return null;
  return (await res.json()) as ConsentsState;
}

/**
 * Records acceptance of the current Terms version. Refreshes the access
 * token first if needed.
 */
export async function acceptCurrentTerms(): Promise<ConsentsState | null> {
  const store = await cookies();
  let access = store.get(COOKIE_ACCESS)?.value;

  if (!access) {
    const refreshed = await performRefresh();
    if (!refreshed) return null;
    access = refreshed.accessToken;
  }

  const res = await fetch(`${API}/me/consents/accept-terms`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as ConsentsState;
}

// Re-export to keep import surface stable
export { getRefreshToken, setAuthCookies };
