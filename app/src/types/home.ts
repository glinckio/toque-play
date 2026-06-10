export interface DashboardData {
  upcomingTournaments: TournamentPreview[];
  pendingFriendlies: FriendlyPreview[];
  acceptedFriendlies: AcceptedFriendly[];
  unreadNotifications: number;
}

export interface TournamentPreview {
  id: string;
  name: string;
  startDate: string;
  city: string;
  location?: string;
  modality: string;
  registrationCount: number;
  isRegistered?: boolean;
}

export interface FriendlyPreview {
  id: string;
  title: string | null;
  teamAName: string;
  teamBName: string;
  date: string;
  status: string;
}

export interface AcceptedFriendly {
  id: string;
  match?: {
    id: string;
    status: string;
    scoreTeamA: number;
    scoreTeamB: number;
    teamA: { id: string; name: string } | null;
    teamB: { id: string; name: string } | null;
    sets?: { setNumber: number; scoreA: number; scoreB: number }[];
  } | null;
  requesterTeam?: { id: string; name: string } | null;
  challengedTeam?: { id: string; name: string } | null;
}

export type FeedItem =
  | { type: 'NEW_TOURNAMENT'; referenceId: string; title: string; subtitle?: string; timestamp: string }
  | { type: 'TOURNAMENT_RESULT'; referenceId: string; title: string; subtitle?: string; timestamp: string }
  | { type: 'FRIENDLY_CONFIRMED'; referenceId: string; title: string; subtitle?: string; timestamp: string };
