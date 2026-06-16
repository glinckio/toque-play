import "server-only";
import { serverGet } from "./index";

export interface AdminDashboard {
  totalUsers: number;
  activeUsersLast30d: number;
  tournamentsByStatus: Record<string, number>;
  totalMatches: number;
  totalTeams: number;
  // Campos estendidos (opcionais até o backend incluir):
  revenueByMonth?: { month: string; value: number }[];
  registrationsByDay?: { day: string; value: number }[];
  usersByRole?: { name: string; value: number; color: string }[];
  modalityBreakdown?: { name: string; value: number; color: string }[];
  revenue30dCents?: number;
  registrationsPending?: number;
  refundsOpen?: number;
}

export interface AdminTournamentDetail {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  eventType: string;
  status: string;
  isPublished: boolean;
  ownerId: string;
  owner?: { id: string; name: string; email: string };
  categories: Array<{
    id: string;
    type: string;
    format: string;
    modality: string;
    minMembers: number;
    maxMembers: number;
    bestOfSets: number;
    tiebreakScore: number | null;
    registrationPrice: string | number | null;
  }>;
  stages: Array<{
    id: string;
    name?: string | null;
    date: string;
    startTime?: string | null;
    maxTeams?: number | null;
    city?: string | null;
    state?: string | null;
    address?: string | null;
  }>;
  _count?: {
    registrations: number;
    brackets: number;
    athleteStats: number;
  };
}

export function getDashboard() {
  return serverGet<AdminDashboard>("admin/dashboard");
}

export function getTournament(id: string) {
  return serverGet<AdminTournamentDetail>(`admin/tournaments/${id}`);
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
  phone?: string | null;
  bio?: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  _count?: {
    teams: number;
    teamMembers: number;
    registrations: number;
    tournaments: number;
  };
}

export function getUser(id: string) {
  return serverGet<AdminUserDetail>(`admin/users/${id}`);
}

