import api from './api';
import { Registration, RegisterTeamDto } from '../types/registration';

export const registrationService = {
  registerTeam: (tournamentId: string, data: RegisterTeamDto) =>
    api.post<Registration>(`/tournaments/${tournamentId}/register`, data).then((r) => r.data),

  findOne: (id: string) =>
    api.get<Registration>(`/registrations/${id}`).then((r) => r.data),

  createCheckout: (id: string) =>
    api.post<{ url: string }>(`/registrations/${id}/checkout`).then((r) => r.data),

  listMine: () =>
    api.get<Registration[]>('/registrations').then((r) => r.data),

  getRegisteredMembers: (tournamentId: string, teamId: string) =>
    api.get<{ memberIds: string[] }>(`/tournaments/${tournamentId}/registrations/registered-members`, { params: { teamId } }).then((r) => r.data),

  cancel: (id: string) =>
    api.delete(`/registrations/${id}`).then((r) => r.data),
};
