"use client";

import { ApiError, type Paginated } from "./types";

export type { Paginated };

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  query?: Record<string, string | number | undefined | null>,
): Promise<T> {
  const search = query
    ? new URLSearchParams(
        Object.entries(query).filter(([, v]) => v != null && v !== "") as [string, string][],
      ).toString()
    : "";
  const url = `/api/proxy/${path.replace(/^\//, "")}${search ? `?${search}` : ""}`;

  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (res.status === 401) {
    throw new ApiError(401, "Sessão expirada");
  }
  if (!res.ok) {
    const text = await res.text();
    let message = `Erro ${res.status}`;
    try {
      const body = JSON.parse(text);
      message = body?.message ?? message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, query?: Record<string, string | number | undefined | null>) =>
    request<T>("GET", path, undefined, query),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
