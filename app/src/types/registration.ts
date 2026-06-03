export enum RegistrationStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export interface Registration {
  id: string;
  tournamentId: string;
  categoryId: string;
  teamId: string;
  userId: string;
  status: RegistrationStatus;
  paymentId: string | null;
  paymentStatus: string | null;
  paidAt: string | null;
  createdAt: string;
  tournament?: {
    id: string;
    name: string;
    status: string;
    stages: { date: string; city: string | null; state: string | null }[];
  };
  category?: {
    id: string;
    type: string;
    format: string;
    modality: string;
    registrationPrice: number | null;
  };
  team?: { id: string; name: string };
}

export interface RegisterTeamDto {
  teamId: string;
  categoryId: string;
  memberIds: string[];
  captainMemberId?: string;
}
