import api from './api';
import { Tournament, GenerateBracketDto } from '../types/tournament';
import { BracketResponse, RankingResponse } from '../types/match';

export interface ExploreResponse {
  nearby: Tournament[];
  all: Tournament[];
  hasMore: boolean;
  nextCursor: string | null;
}

export const tournamentService = {
  create: (data: { name: string; description?: string }) =>
    api.post('/tournaments', data).then((r) => r.data),

  updateStructure: (id: string, data: any) =>
    api.patch(`/tournaments/${id}/structure`, data).then((r) => r.data),

  addSponsors: (id: string, sponsors: { name: string }[]) =>
    api.post(`/tournaments/${id}/sponsors`, { sponsors }).then((r) => r.data),

  publish: (id: string) =>
    api.patch(`/tournaments/${id}/publish`).then((r) => r.data),

  findMine: () =>
    api.get<Tournament[]>('/tournaments/mine').then((r) => r.data),

  explore: (params?: Record<string, string>) =>
    api.get<ExploreResponse>('/tournaments/explore', { params }).then((r) => {
      const d = r.data;
      // Handle both paginated response { all, nearby } and flat array
      if (Array.isArray(d)) return d;
      return [...(d.nearby ?? []), ...(d.all ?? [])];
    }),

  findOne: (id: string) =>
    api.get<Tournament>(`/tournaments/${id}`).then((r) => r.data),

  generateBracket: (id: string, data: GenerateBracketDto) =>
    api.post(`/tournaments/${id}/generate-bracket`, data).then((r) => r.data),

  getBracket: (id: string, categoryId?: string) =>
    api.get<BracketResponse[]>(`/tournaments/${id}/bracket`, { params: { categoryId } }).then((r) => r.data),

  getRanking: (id: string) =>
    api.get<RankingResponse>(`/tournaments/${id}/ranking`).then((r) => r.data),

  startTournament: (id: string) =>
    api.patch(`/tournaments/${id}/start`).then((r) => r.data),

  generateRefereeCode: (id: string) =>
    api.post(`/tournaments/${id}/generate-referee-code`).then((r) => r.data),

  enterRefereeCode: (code: string) =>
    api.post('/tournaments/referee-enter', { code }).then((r) => r.data),

  addReferee: (id: string, email: string) =>
    api.post(`/tournaments/${id}/referees`, { email }).then((r) => r.data),

  removeReferee: (id: string, refereeId: string) =>
    api.delete(`/tournaments/${id}/referees/${refereeId}`).then((r) => r.data),

  getReferees: (id: string) =>
    api.get(`/tournaments/${id}/referees`).then((r) => r.data),

  findRefereeMine: () =>
    api.get('/tournaments/referee-mine').then((r) => r.data),

  cancel: (id: string) =>
    api.delete(`/tournaments/${id}`).then((r) => r.data),
};
