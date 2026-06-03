import api from './api';
import type { Friendly, CreateFriendlyDto, AcceptFriendlyDto } from '../types/friendly';

export const friendlyService = {
  create: (data: CreateFriendlyDto) =>
    api.post<Friendly>('/friendlies', data).then((r) => r.data),

  explore: (query?: Record<string, string>) =>
    api.get<Friendly[]>('/friendlies/explore', { params: query }).then((r) => r.data),

  findMine: (query?: Record<string, string>) =>
    api.get<Friendly[]>('/friendlies', { params: query }).then((r) => r.data),

  findOne: (id: string) =>
    api.get<Friendly>(`/friendlies/${id}`).then((r) => r.data),

  accept: (id: string, athleteIds: string[], captainId?: string) =>
    api.patch<Friendly>(`/friendlies/${id}/accept`, { athleteIds, captainId } as AcceptFriendlyDto).then((r) => r.data),

  reject: (id: string) =>
    api.patch(`/friendlies/${id}/reject`).then((r) => r.data),

  cancel: (id: string) =>
    api.patch(`/friendlies/${id}/cancel`).then((r) => r.data),

  selectAthletes: (id: string, athleteIds: string[]) =>
    api.patch(`/friendlies/${id}/select-athletes`, { athleteIds }).then((r) => r.data),

  generateRefereeCode: (id: string) =>
    api.post<{ refereeCode: string }>(`/friendlies/${id}/generate-referee-code`).then((r) => r.data),

  enterRefereeCode: (code: string) =>
    api.post('/friendlies/referee-enter', { code }).then((r) => r.data),
};
