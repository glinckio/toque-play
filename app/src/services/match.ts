import api from './api';

export interface LiveMatch {
  id: string;
  status: string;
  scoreTeamA: number;
  scoreTeamB: number;
  startedAt: string;
  teamA: { id: string; name: string; avatarUrl: string | null };
  teamB: { id: string; name: string; avatarUrl: string | null };
  sets: { setNumber: number; scoreA: number; scoreB: number }[];
  tournamentId?: string;
  bracket?: { tournamentId: string; tournament?: { name: string } };
}

export const matchService = {
  // Existing
  getNearby: (latitude: number, longitude: number, radius = 50) =>
    api.get<LiveMatch[]>('/matches/nearby', { params: { latitude, longitude, radius } }).then((r) => r.data),

  // Match lifecycle
  findOne: (matchId: string) =>
    api.get(`/matches/${matchId}`).then((r) => r.data),

  startMatch: (matchId: string) =>
    api.patch(`/matches/${matchId}/start`).then((r) => r.data),

  registerPoint: (matchId: string, team: 'A' | 'B') =>
    api.patch(`/matches/${matchId}/point`, { team }).then((r) => r.data),

  removePoint: (matchId: string, team: 'A' | 'B') =>
    api.patch(`/matches/${matchId}/remove-point`, { team }).then((r) => r.data),

  finishSet: (matchId: string, setNumber: number) =>
    api.patch(`/matches/${matchId}/set-finish`, { setNumber }).then((r) => r.data),

  finishMatch: (matchId: string) =>
    api.patch(`/matches/${matchId}/finish`).then((r) => r.data),

  declareWalkover: (matchId: string, winnerTeam: 'A' | 'B') =>
    api.patch(`/matches/${matchId}/walkover`, { winnerTeam }).then((r) => r.data),

  registerTimeout: (matchId: string, team?: 'A' | 'B') =>
    api.patch(`/matches/${matchId}/timeout`, { team }).then((r) => r.data),

  registerSubstitution: (matchId: string, data: { teamId: string; playerOutId: string; playerInId: string }) =>
    api.patch(`/matches/${matchId}/substitution`, data).then((r) => r.data),

  // Referee code
  generateRefereeCode: (matchId: string) =>
    api.post(`/matches/${matchId}/generate-referee-code`).then((r) => r.data),

  enterRefereeCode: (code: string) =>
    api.post('/matches/referee-enter', { code }).then((r) => r.data),

  // Timeline (historical)
  getTimeline: (matchId: string) =>
    api.get(`/matches/${matchId}/timeline`).then((r) => r.data),
};
