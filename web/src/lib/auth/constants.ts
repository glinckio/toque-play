export const COOKIE_ACCESS = "tp_access";
export const COOKIE_REFRESH = "tp_refresh";
export const COOKIE_USER = "tp_user";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: string;
}
