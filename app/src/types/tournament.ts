export type TournamentStatus = 'DRAFT' | 'PUBLISHED' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'BRACKET_GENERATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export enum BracketType {
  SINGLE_ELIMINATION = 'SINGLE_ELIMINATION',
  DOUBLE_ELIMINATION = 'DOUBLE_ELIMINATION',
  ROUND_ROBIN = 'ROUND_ROBIN',
  GROUPS_THEN_ELIMINATION = 'GROUPS_THEN_ELIMINATION',
}

export interface GenerateBracketDto {
  categoryId: string;
  type: BracketType;
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  eventType: 'SINGLE' | 'CIRCUIT';
  status: TournamentStatus;
  ownerId: string;
  stages?: TournamentStage[];
  categories?: TournamentCategory[];
  sponsors?: TournamentSponsor[];
  registrationCount?: number;
  _count?: { registrations: number };
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface TournamentStage {
  id: string;
  date: string;
  startTime: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  maxTeams: number | null;
  latitude: number | null;
  longitude: number | null;
  facilities?: { id: string; name: string; available: boolean }[];
}

export interface TournamentCategory {
  id: string;
  type: string;
  format: string;
  modality: string;
  minMembers: number;
  maxMembers: number;
  bestOfSets: number;
  registrationPrice: number | null;
  price?: number;
  registrationDeadline: string | null;
  bracketType?: BracketType | null;
  groupsCount?: number | null;
  teamsPerGroup?: number | null;
  teamsAdvancing?: number | null;
}

export interface TournamentSponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  description: string | null;
}
