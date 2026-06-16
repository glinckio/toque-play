import api from './api';

export interface ConsentsState {
  version: string;
  lastAcceptedAt: string | null;
  consents: {
    terms: boolean;
    notificationsPush: boolean;
    locationDiscovery: boolean;
    marketingEmail: boolean;
  };
}

export interface DataSummary {
  userId: string;
  teams: number;
  registrations: number;
  friendliesRequested: number;
  notifications: number;
  chatMessages: number;
  consents: number;
}

export interface UserDataExport {
  generatedAt: string;
  user: unknown;
  consents: unknown;
  teamMembers: unknown;
  registrations: unknown;
  friendliesRequested: unknown;
  notifications: unknown;
  chatMessages: unknown;
  auditLogs: unknown;
}

export const privacyService = {
  getConsents: () =>
    api.get<ConsentsState>('/me/consents').then((r) => r.data),

  updateConsents: (data: {
    notificationsPush?: boolean;
    locationDiscovery?: boolean;
    marketingEmail?: boolean;
  }) => api.put<ConsentsState>('/me/consents', data).then((r) => r.data),

  getDataSummary: () =>
    api.get<DataSummary>('/me/data-summary').then((r) => r.data),

  exportData: () =>
    api.post<UserDataExport>('/me/export').then((r) => r.data),

  deleteAccount: (email: string) =>
    api.delete<{ message: string }>('/me/delete-account', { data: { email } }).then((r) => r.data),
};
