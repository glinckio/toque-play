/**
 * Base URL for public-facing legal docs. Override per environment via
 * EXPO_PUBLIC_WEB_URL (Expo client-side env). Defaults to production domain.
 *
 * Web admin serves /terms-of-use and /privacy-policy as public routes
 * (see web/src/app/(legal)/*).
 */
const WEB_URL =
  process.env.EXPO_PUBLIC_WEB_URL ?? 'https://toqueplay.com';

export const PRIVACY_POLICY_URL = `${WEB_URL}/privacy-policy`;
export const TERMS_OF_USE_URL = `${WEB_URL}/terms-of-use`;
