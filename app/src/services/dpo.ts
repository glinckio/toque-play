import api from './api';

export type DpoRequestType =
  | 'ACCESS'
  | 'PORTABILITY'
  | 'RECTIFICATION'
  | 'DELETION'
  | 'COMPLAINT'
  | 'OTHER';

export interface CreateDpoRequest {
  type: DpoRequestType;
  subject: string;
  message: string;
  email?: string;
}

export interface DpoRequest {
  id: string;
  userId: string | null;
  email: string;
  type: DpoRequestType;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export const dpoService = {
  create: (data: CreateDpoRequest) =>
    api.post<DpoRequest>('/me/dpo-contact', data).then((r) => r.data),
};
