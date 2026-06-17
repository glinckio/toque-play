import { useEffect } from 'react';
import { privacyService } from '../services/privacy';
import { useAuthStore } from '../stores/authStore';

/**
 * Verifies Terms version after login/boot. If the accepted version differs
 * from the current backend TERMS_VERSION, flips `requiresReconsent` so the
 * App gates navigation behind the PrivacyConsentScreen.
 */
export function useConsentCheck() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const setRequiresReconsent = useAuthStore((s) => s.setRequiresReconsent);

  useEffect(() => {
    if (!isAuthenticated || !hasHydrated) return;
    let cancelled = false;

    (async () => {
      try {
        const state = await privacyService.getConsents();
        if (cancelled) return;
        setRequiresReconsent(!!state.termsOutdated);
      } catch {
        // Network/401 — do not block the user; PrivacyConsentScreen is
        // still reachable manually from Profile.
        if (!cancelled) setRequiresReconsent(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, hasHydrated, setRequiresReconsent]);
}
