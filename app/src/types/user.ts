export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  bio: string | null;
  isFirstAccess: boolean;
  isEmailVerified: boolean;
  notificationPreferences?: Record<string, boolean> | null;
}
