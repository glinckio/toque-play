import { Platform } from 'react-native';
import api from './api';
import type {
  Team,
  TeamMember,
  TeamInvitation,
  CreateTeamDto,
  UpdateTeamDto,
  AddMemberDto,
  AddGuestDto,
} from '../types/team';

export const teamService = {
  findAll: () =>
    api.get<Team[]>('/teams').then((r) => r.data),

  findOne: (id: string) =>
    api.get<Team>(`/teams/${id}`).then((r) => r.data),

  create: (data: CreateTeamDto) =>
    api.post<Team>('/teams', data).then((r) => r.data),

  update: (id: string, data: UpdateTeamDto) =>
    api.patch<Team>(`/teams/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/teams/${id}`),

  findMembers: (teamId: string) =>
    api.get<TeamMember[]>(`/teams/${teamId}/members`).then((r) => r.data),

  addMember: (teamId: string, data: AddMemberDto) =>
    api.post(`/teams/${teamId}/members`, data).then((r) => r.data),

  addGuest: (teamId: string, data: AddGuestDto) =>
    api.post(`/teams/${teamId}/members/guest`, data).then((r) => r.data),

  updateMember: (teamId: string, memberId: string, data: { isCaptain?: boolean; position?: string }) =>
    api.patch(`/teams/${teamId}/members/${memberId}`, data).then((r) => r.data),

  removeMember: (teamId: string, memberId: string) =>
    api.delete(`/teams/${teamId}/members/${memberId}`),

  search: (q: string) =>
    api.get<Team[]>('/teams/search', { params: { q } }).then((r) => r.data),

  findPendingInvitations: () =>
    api.get<TeamInvitation[]>('/team-invitations/pending').then((r) => r.data),

  acceptInvitation: (id: string) =>
    api.patch(`/team-invitations/${id}/accept`).then((r) => r.data),

  rejectInvitation: (id: string) =>
    api.patch(`/team-invitations/${id}/reject`).then((r) => r.data),

  uploadAvatar: async (teamId: string, uri: string): Promise<Team> => {
    const formData = new FormData();

    const filename = uri.split('/').pop() ?? 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match?.[1]?.toLowerCase() ?? 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    formData.append('file', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: filename,
      type: mimeType,
    } as any);

    const { data } = await api.post<Team>(`/teams/${teamId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
