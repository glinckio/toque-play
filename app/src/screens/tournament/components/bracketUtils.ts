import type { Match } from '../../../types/match';
import type { StandingEntry } from './InlineStandingsTable';

export function computeStandings(matches: Match[]): StandingEntry[] {
  const teamMap = new Map<string, StandingEntry>();
  for (const m of matches) {
    const isFinished = m.status !== 'SCHEDULED';
    if (m.teamA) {
      const t =
        teamMap.get(m.teamA.id) ?? {
          id: m.teamA.id,
          name: m.teamA.name,
          wins: 0,
          played: 0,
          pointsScored: 0,
        };
      if (isFinished) {
        t.played++;
        t.pointsScored += m.scoreTeamA;
      }
      if (m.winnerId === m.teamA.id) t.wins++;
      teamMap.set(m.teamA.id, t);
    }
    if (m.teamB) {
      const t =
        teamMap.get(m.teamB.id) ?? {
          id: m.teamB.id,
          name: m.teamB.name,
          wins: 0,
          played: 0,
          pointsScored: 0,
        };
      if (isFinished) {
        t.played++;
        t.pointsScored += m.scoreTeamB;
      }
      if (m.winnerId === m.teamB.id) t.wins++;
      teamMap.set(m.teamB.id, t);
    }
  }
  return Array.from(teamMap.values()).sort(
    (a, b) => b.wins - a.wins || b.pointsScored - a.pointsScored,
  );
}

export function groupByRound(matches: Match[]): [string, Match[]][] {
  const sorted = [...matches].sort(
    (a, b) => a.round - b.round || a.position - b.position,
  );
  const rounds: Record<number, Match[]> = {};
  for (const m of sorted) {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  }
  return Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));
}
