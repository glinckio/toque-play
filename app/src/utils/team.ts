import type { Team } from '../types/team';

export function memberCount(team: Team): number {
  // If members array is populated and non-empty, use it
  if (team.members && team.members.length > 0) return team.members.length;
  // Otherwise use _count from API
  const c = (team as any)._count;
  return c?.members ?? 0;
}
