import "server-only";
import { cookies } from "next/headers";
import { COOKIE_ACCESS } from "@/lib/auth/constants";
import { performRefresh } from "@/lib/auth/session";
import { ApiError, type Paginated } from "./types";

export { ApiError, type Paginated };

const API = process.env.API_INTERNAL_URL ?? "http://localhost:3000/api";

async function refreshIfNeeded(res: Response): Promise<string | null> {
  if (res.status !== 401) return null;
  const refreshed = await performRefresh();
  return refreshed?.accessToken ?? null;
}

/** GET server-side direto ao backend com cookie auth + auto-refresh. */
export async function serverGet<T>(path: string): Promise<T> {
  const store = await cookies();
  let access = store.get(COOKIE_ACCESS)?.value;

  if (!access) {
    const refreshed = await performRefresh();
    if (!refreshed) throw new ApiError(401, "Sessão expirada");
    access = refreshed.accessToken;
  }

  let res = await fetch(`${API}/${path.replace(/^\//, "")}`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    const newAccess = await refreshIfNeeded(res);
    if (newAccess) {
      res = await fetch(`${API}/${path.replace(/^\//, "")}`, {
        headers: { Authorization: `Bearer ${newAccess}` },
        cache: "no-store",
      });
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, await safeError(res));
  }
  return (await res.json()) as T;
}

async function safeError(res: Response): Promise<string> {
  try {
    const body = await res.clone().json();
    return body?.message ?? `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}
