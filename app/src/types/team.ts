export interface Team {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  sport: string;
  ownerId: string;
  members?: TeamMember[];
  _count?: { members: number };
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string | null;
  isGuest: boolean;
  isCaptain: boolean;
  guestName?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
}

export interface CreateTeamDto {
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
  avatarUrl?: string;
}

export interface AddMemberDto {
  email: string;
}

export interface AddGuestDto {
  guestName: string;
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface TeamInvitation {
  id: string;
  teamId: string;
  invitedUserId: string;
  invitedById: string;
  status: InvitationStatus;
  createdAt: string;
  team: {
    id: string;
    name: string;
    avatarUrl: string | null;
    owner: { id: string; name: string; avatarUrl: string | null };
  };
}
