import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from '../storage/secureStorage';
import { User } from '../types/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  requiresReconsent: boolean;
  _hasHydrated: boolean;

  setAuth: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
  setRequiresReconsent: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      requiresReconsent: false,
      _hasHydrated: false,

      setAuth: (data) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
          isAuthenticated: true,
          requiresReconsent: false,
        }),

      setUser: (user) => set({ user }),

      clearAuth: () => {
        // Also wipe the persisted keychain entry so next login starts fresh
        // (prevents stale tokens being re-hydrated into a half-cleared state).
        void secureStorage.removeItem('auth-storage');
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          requiresReconsent: false,
        });
      },

      setHasHydrated: (value) => set({ _hasHydrated: value }),
      setRequiresReconsent: (value) => set({ requiresReconsent: value }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        // Fallback: if hydration doesn't complete in 3s, force it
        const timer = setTimeout(() => {
          const current = useAuthStore.getState();
          if (!current._hasHydrated) {
            current.setHasHydrated(true);
          }
        }, 3000);
        return (state) => {
          clearTimeout(timer);
          state?.setHasHydrated(true);
        };
      },
    }
  )
);
