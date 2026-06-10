import api from './api';
import { AppNotification } from '../types/notification';

export const notificationService = {
  findMine: () =>
    api.get<{ data: AppNotification[] }>('/notifications', { params: { unread: true } }).then((r) => r.data.data),

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count').then((r) => r.data.count),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () =>
    api.patch('/notifications/read-all').then((r) => r.data),
};
