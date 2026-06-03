export enum FriendlyStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface FriendlyAthlete {
  id: string;
  friendlyId: string;
  teamMemberId: string;
  side: 'REQUESTER' | 'CHALLENGED';
  isCaptain: boolean;
  teamMember?: {
    id: string;
    user?: { id: string; name: string; avatarUrl: string | null } | null;
    guestName?: string | null;
    isGuest: boolean;
    isCaptain: boolean;
  } | null;
}

export interface Friendly {
  id: string;
  title: string | null;
  description: string | null;
  requesterId: string;
  requesterTeamId: string | null;
  challengedId: string | null;
  challengedTeamId: string | null;
  status: FriendlyStatus;
  date: string;
  startTime: string | null;
  address: string | null;
  addressNumber: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  regionRadius: number | null;
  scoreTeamA: number | null;
  scoreTeamB: number | null;
  modality: string | null;
  categoryFormat: string | null;
  matchId: string | null;
  refereeCode: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: { id: string; name: string; avatarUrl: string | null } | null;
  requesterTeam?: { id: string; name: string; avatarUrl: string | null } | null;
  challenged?: { id: string; name: string; avatarUrl: string | null } | null;
  challengedTeam?: { id: string; name: string; avatarUrl: string | null } | null;
  athletes?: FriendlyAthlete[];
  match?: {
    id: string;
    status: string;
    winnerId: string | null;
    scoreTeamA: number | null;
    scoreTeamB: number | null;
    sets?: { id: string; setNumber: number; scoreA: number; scoreB: number }[];
    pointEvents?: { id: string; setNumber: number; scoredBy: string; timestamp: string }[];
  } | null;
}

export const FRIENDLY_STATUS_LABELS: Record<FriendlyStatus, string> = {
  [FriendlyStatus.PENDING]: 'Pendente',
  [FriendlyStatus.ACCEPTED]: 'Aceito',
  [FriendlyStatus.REJECTED]: 'Rejeitado',
  [FriendlyStatus.CANCELLED]: 'Cancelado',
  [FriendlyStatus.COMPLETED]: 'Concluído',
};

export interface CreateFriendlyDto {
  title?: string;
  description?: string;
  requesterTeamId?: string;
  challengedId?: string;
  challengedTeamId?: string;
  date: string;
  startTime?: string;
  address?: string;
  addressNumber?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  regionRadius?: number;
  modality?: string;
  categoryFormat?: string;
  athleteIds?: string[];
  captainId?: string;
}

export interface AcceptFriendlyDto {
  athleteIds: string[];
  captainId?: string;
}
