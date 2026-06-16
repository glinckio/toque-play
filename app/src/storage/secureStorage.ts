import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

/**
 * Zustand-compatible adapter around expo-secure-store.
 * Stores key/value pairs in the OS keychain (iOS) or Android Keystore.
 * Limits: ~2KB per value on iOS — keep the auth payload small.
 */
export const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        requireAuthentication: false,
      });
    } catch {
      // If the value exceeds the keychain limit or keystore fails, fall back to
      // dropping the write rather than crashing the app. Auth will re-prompt login.
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      /* ignore */
    }
  },
};
