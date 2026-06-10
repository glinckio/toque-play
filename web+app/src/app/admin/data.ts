import { friendlies, matches, registrations, teams, tournaments, users, notifications } from '../data/mocks';

export const adminMetrics = {
  totalUsers: 4823,
  newUsersThisMonth: 312,
  activeTournaments: 28,
  matchesPlayed30d: 1467,
  revenue30dCents: 18420090,
  registrationsPending: 14,
  refundsOpen: 3,
  arbitragensAtivas: 42,
};

export const revenueByMonth = [
  { month: 'Jan', value: 82000 },
  { month: 'Fev', value: 96500 },
  { month: 'Mar', value: 118000 },
  { month: 'Abr', value: 134200 },
  { month: 'Mai', value: 152800 },
  { month: 'Jun', value: 184200 },
];

export const registrationsByDay = [
  { day: '03', value: 28 },
  { day: '04', value: 42 },
  { day: '05', value: 36 },
  { day: '06', value: 58 },
  { day: '07', value: 74 },
  { day: '08', value: 61 },
  { day: '09', value: 88 },
];

export const usersByRole = [
  { name: 'Jogadores', value: 4120, color: '#6D2EC0' },
  { name: 'Organizadores', value: 489, color: '#A674F0' },
  { name: 'Árbitros', value: 198, color: '#1FB87A' },
  { name: 'Admins', value: 16, color: '#F0A030' },
];

export const modalityBreakdown = [
  { name: 'Praia', value: 62, color: '#F0A030' },
  { name: 'Quadra', value: 38, color: '#6D2EC0' },
];

export const adminUsers = [
  ...users,
  { id: 'u5', name: 'Pedro Henrique', email: 'pedro@toqueplay.app', role: 'PLAYER' as const, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 'u6', name: 'Camila Ferraz', email: 'camila@toqueplay.app', role: 'ORGANIZADOR' as const, avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop' },
  { id: 'u7', name: 'Tiago Reis', email: 'tiago@toqueplay.app', role: 'PLAYER' as const, avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' },
  { id: 'u8', name: 'Aline Prado', email: 'aline@toqueplay.app', role: 'PLAYER' as const, avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop' },
];

export type AdminUserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING';
export const userStatuses: Record<string, AdminUserStatus> = {
  u1: 'ACTIVE', u2: 'ACTIVE', u3: 'ACTIVE', u4: 'ACTIVE', u5: 'PENDING', u6: 'ACTIVE', u7: 'SUSPENDED', u8: 'ACTIVE',
};

export interface Payment {
  id: string;
  user: string;
  email: string;
  tournament: string;
  amountCents: number;
  method: 'CARD' | 'PIX';
  status: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  stripeId: string;
  createdAt: string;
}

export const payments: Payment[] = [
  { id: 'p1', user: 'Marina Costa', email: 'marina@toqueplay.app', tournament: 'Circuito Verão Praia 2026', amountCents: 15000, method: 'CARD', status: 'PAID', stripeId: 'pi_3OabK2L9P1Q', createdAt: '2026-06-09T10:24:00' },
  { id: 'p2', user: 'Rafael Souza', email: 'rafael@toqueplay.app', tournament: 'Circuito Verão Praia 2026', amountCents: 15000, method: 'CARD', status: 'PAID', stripeId: 'pi_3OabL5M2N4', createdAt: '2026-06-09T09:12:00' },
  { id: 'p3', user: 'Beatriz Lima', email: 'beatriz@toqueplay.app', tournament: 'Copa Universitária Indoor', amountCents: 20000, method: 'CARD', status: 'PENDING', stripeId: 'pi_3OabZ8X9Y2', createdAt: '2026-06-09T08:48:00' },
  { id: 'p4', user: 'Pedro Henrique', email: 'pedro@toqueplay.app', tournament: 'Festival Maresia', amountCents: 12000, method: 'CARD', status: 'REFUNDED', stripeId: 'pi_3OabA1B2C3', createdAt: '2026-06-08T16:30:00' },
  { id: 'p5', user: 'Camila Ferraz', email: 'camila@toqueplay.app', tournament: 'Circuito Verão Praia 2026', amountCents: 15000, method: 'CARD', status: 'PAID', stripeId: 'pi_3OabD4E5F6', createdAt: '2026-06-08T14:15:00' },
  { id: 'p6', user: 'Aline Prado', email: 'aline@toqueplay.app', tournament: 'Copa Universitária Indoor', amountCents: 20000, method: 'CARD', status: 'FAILED', stripeId: 'pi_3OabG7H8I9', createdAt: '2026-06-08T11:02:00' },
  { id: 'p7', user: 'Tiago Reis', email: 'tiago@toqueplay.app', tournament: 'Circuito Verão Praia 2026', amountCents: 15000, method: 'CARD', status: 'PAID', stripeId: 'pi_3OabJ0K1L2', createdAt: '2026-06-07T22:48:00' },
];

export const recentActivity = [
  { id: 'a1', kind: 'PAYMENT', icon: 'card', text: 'Marina Costa pagou R$ 150 — Circuito Verão Praia', at: '2 min' },
  { id: 'a2', kind: 'TOURNAMENT', icon: 'trophy', text: 'Camila Ferraz publicou um novo torneio: Beach Open SP', at: '14 min' },
  { id: 'a3', kind: 'REFUND', icon: 'rotate', text: 'Reembolso aprovado: Pedro Henrique — R$ 120', at: '38 min' },
  { id: 'a4', kind: 'USER', icon: 'user', text: 'Aline Prado completou cadastro', at: '1 h' },
  { id: 'a5', kind: 'MATCH', icon: 'play', text: 'Partida das quartas iniciada — Tigres vs Tubarões', at: '2 h' },
  { id: 'a6', kind: 'DISPUTE', icon: 'alert', text: 'Disputa aberta no pagamento pi_3OabA1B2C3', at: '3 h' },
];

export { friendlies, matches, registrations, teams, tournaments, notifications };
