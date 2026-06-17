import type { TeamMember } from '../../types/team';

export function memberName(m: TeamMember): string {
  return m.user?.name ?? m.guestName ?? '?';
}
