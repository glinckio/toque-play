import { colors } from '../../theme/colors';

export type NotifType =
  | 'FRIENDLY_REQUEST'
  | 'FRIENDLY_ACCEPTED'
  | 'FRIENDLY_REJECTED'
  | 'TOURNAMENT_UPDATE'
  | 'REGISTRATION_CONFIRMED'
  | 'BRACKET_GENERATED'
  | 'TOURNAMENT_STARTED'
  | 'TOURNAMENT_COMPLETED'
  | 'MATCH_REMINDER'
  | 'MATCH_SET'
  | 'MATCH_FINISH'
  | 'REFEREE_ASSIGNED'
  | 'TEAM_INVITE';

export const ICON_MAP: Record<string, string> = {
  FRIENDLY_REQUEST: 'tennisball-outline',
  FRIENDLY_ACCEPTED: 'checkmark-circle-outline',
  FRIENDLY_REJECTED: 'close-circle-outline',
  TOURNAMENT_UPDATE: 'trophy-outline',
  REGISTRATION_CONFIRMED: 'checkmark-done-outline',
  BRACKET_GENERATED: 'git-branch-outline',
  TOURNAMENT_STARTED: 'flag-outline',
  TOURNAMENT_COMPLETED: 'trophy-outline',
  MATCH_REMINDER: 'notifications-outline',
  MATCH_SET: 'tennisball-outline',
  MATCH_FINISH: 'checkmark-done-circle-outline',
  REFEREE_ASSIGNED: 'people-outline',
  TEAM_INVITE: 'shield-outline',
};

export const ICON_BG_MAP: Record<string, string[]> = {
  FRIENDLY_REQUEST: [colors.primary, colors.primaryLight],
  FRIENDLY_ACCEPTED: [colors.success, '#2DD89B'],
  FRIENDLY_REJECTED: [colors.error, '#FF6B6B'],
  TOURNAMENT_UPDATE: [colors.primaryDark, colors.primary],
  REGISTRATION_CONFIRMED: [colors.success, '#2DD89B'],
  BRACKET_GENERATED: [colors.primaryDark, colors.primary],
  TOURNAMENT_STARTED: [colors.primary, colors.primaryLight],
  TOURNAMENT_COMPLETED: [colors.warning, '#F6C168'],
  MATCH_REMINDER: [colors.warning, '#F6C168'],
  MATCH_SET: [colors.primary, colors.primaryLight],
  MATCH_FINISH: [colors.success, '#2DD89B'],
  REFEREE_ASSIGNED: [colors.dark, colors.darkSecondary],
  TEAM_INVITE: [colors.primary, colors.primaryLight],
};

export const FRIENDLY_TYPES = [
  'FRIENDLY_REQUEST',
  'FRIENDLY_ACCEPTED',
  'FRIENDLY_REJECTED',
];

export const TOURNAMENT_TYPES = [
  'TOURNAMENT_UPDATE',
  'REGISTRATION_CONFIRMED',
  'BRACKET_GENERATED',
  'TOURNAMENT_STARTED',
  'TOURNAMENT_COMPLETED',
  'REFEREE_ASSIGNED',
];

export const MATCH_TYPES = ['MATCH_SET', 'MATCH_FINISH', 'MATCH_REMINDER'];

export interface DisplayItem {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  invitationId?: string;
  referenceId?: string | null;
}

export function groupByDay(items: DisplayItem[]): Record<string, DisplayItem[]> {
  const groups: Record<string, DisplayItem[]> = {};
  for (const item of items) {
    const d = new Date(item.createdAt);
    const key = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    groups[key] = groups[key] ?? [];
    groups[key].push(item);
  }
  return groups;
}
