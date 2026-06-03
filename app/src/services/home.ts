import api from './api';
import { DashboardData, FeedItem } from '../types/home';

export const homeService = {
  getDashboard: () =>
    api.get<DashboardData>('/home').then((r) => r.data),

  getFeed: () =>
    api.get<{ items: FeedItem[] }>('/feed').then((r) => r.data.items ?? r.data as any),
};
