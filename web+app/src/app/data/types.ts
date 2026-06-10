export type TournamentStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'BRACKET_GENERATED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELLED';

export type MatchStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'WALKOVER'
  | 'CANCELLED';

export type BracketType =
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'ROUND_ROBIN'
  | 'GROUPS_THEN_ELIMINATION';

export type FriendlyStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export type Modality = 'BEACH' | 'COURT';
export type CategoryFormat = 'PAIR' | 'QUARTET' | 'SEXTET';
export type CategoryType = 'MALE' | 'FEMALE' | 'MIX';
export type EventType = 'SINGLE' | 'CIRCUIT';

export type NotificationType =
  | 'FRIENDLY_REQUEST'
  | 'FRIENDLY_ACCEPTED'
  | 'TOURNAMENT_UPDATE'
  | 'MATCH_REMINDER'
  | 'REFEREE_ASSIGNED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'PLAYER' | 'ORGANIZADOR' | 'SUPER_ADMIN';
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  modality: Modality;
  members: TeamMember[];
  ownerId: string;
  wins: number;
  losses: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  position?: string;
  isCaptain?: boolean;
}

export interface Category {
  id: string;
  type: CategoryType;
  format: CategoryFormat;
  modality: Modality;
  bestOfSets: number;
  tiebreakScore: number;
  bracketType: BracketType;
  registrationPrice?: number;
  registrationDeadline?: string;
  registrationsCount?: number;
}

export interface Stage {
  id: string;
  name?: string;
  date: string;
  startTime?: string;
  city?: string;
  state?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  status: TournamentStatus;
  eventType: EventType;
  isPublished: boolean;
  coverUrl?: string;
  organizer: User;
  stages: Stage[];
  categories: Category[];
  sponsors: { id: string; name: string; logoUrl?: string }[];
  startDate: string;
  city: string;
  state: string;
  participantsCount: number;
  modality: Modality;
}

export interface Friendly {
  id: string;
  title?: string;
  description?: string;
  status: FriendlyStatus;
  date: string;
  startTime?: string;
  city: string;
  state: string;
  address?: string;
  modality: Modality;
  categoryFormat: CategoryFormat;
  requester: User;
  requesterTeam?: Team;
  challenged?: User;
  challengedTeam?: Team;
  athletesRequester: TeamMember[];
  athletesChallenged: TeamMember[];
  scoreTeamA?: number;
  scoreTeamB?: number;
  matchId?: string;
  refereeCode?: string;
}

export interface MatchSet {
  setNumber: number;
  scoreA: number;
  scoreB: number;
  finished: boolean;
}

export interface Match {
  id: string;
  status: MatchStatus;
  teamA: Team;
  teamB: Team;
  sets: MatchSet[];
  bestOfSets: number;
  tiebreakScore: number;
  label?: string;
  scheduledAt: string;
  refereeId?: string;
  winnerId?: string;
  context: 'TOURNAMENT' | 'FRIENDLY';
  tournamentName?: string;
}

export interface Registration {
  id: string;
  tournamentId: string;
  categoryId: string;
  teamId: string;
  athleteIds: string[];
  captainId: string;
  userId: string;
  status: 'CONFIRMED' | 'PENDING_PAYMENT';
  paidAt?: string;
  amountCents?: number;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  targetId?: string;
}
