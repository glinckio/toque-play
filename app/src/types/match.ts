import { BracketType } from './tournament';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  WALKOVER = 'WALKOVER',
  CANCELLED = 'CANCELLED',
}

export interface Match {
  id: string;
  bracketId: string;
  round: number;
  position: number;
  status: MatchStatus;
  scheduledAt: string | null;
  teamAId: string | null;
  teamBId: string | null;
  teamA: { id: string; name: string; avatarUrl: string | null } | null;
  teamB: { id: string; name: string; avatarUrl: string | null } | null;
  scoreTeamA: number;
  scoreTeamB: number;
  winnerId: string | null;
  sets: MatchSet[];
  startedAt: string | null;
  finishedAt: string | null;
  group: number | null;
  bestOfSets: number | null;
  label: string | null;
  refereeId: string | null;
  refereeCode?: string | null;
  nextMatchId?: string | null;
}

export interface MatchSet {
  id: string;
  matchId: string;
  setNumber: number;
  scoreA: number;
  scoreB: number;
}

export interface BracketResponse {
  id: string;
  tournamentId: string;
  categoryId: string;
  type: BracketType;
  category: { id: string; type: string; format: string; modality: string };
  matches: Match[];
}

export interface RankingEntry {
  position: number;
  team: { id: string; name: string; avatarUrl?: string | null };
  points: number;
  wins: number;
}

export interface RankingResponse {
  tournamentId: string;
  ranking: RankingEntry[];
}
