import { FriendlyStatus, MatchStatus, TournamentStatus } from '../data/types';

type AnyStatus = TournamentStatus | MatchStatus | FriendlyStatus;

const colors: Record<string, { bg: string; fg: string; label: string }> = {
  DRAFT: { bg: '#ECECF0', fg: '#6B5B7E', label: 'Rascunho' },
  PUBLISHED: { bg: '#F4EFFA', fg: '#6D2EC0', label: 'Publicado' },
  REGISTRATION_OPEN: { bg: '#E5F8F0', fg: '#1FB87A', label: 'Inscrições abertas' },
  REGISTRATION_CLOSED: { bg: '#FDF1E3', fg: '#B86A12', label: 'Inscrições encerradas' },
  BRACKET_GENERATED: { bg: '#F4EFFA', fg: '#6D2EC0', label: 'Chaves geradas' },
  IN_PROGRESS: { bg: '#E5F8F0', fg: '#1FB87A', label: 'Em andamento' },
  FINISHED: { bg: '#ECECF0', fg: '#3D2C52', label: 'Finalizado' },
  CANCELLED: { bg: '#FBE3E3', fg: '#E04545', label: 'Cancelado' },
  SCHEDULED: { bg: '#F4EFFA', fg: '#6D2EC0', label: 'Agendado' },
  WALKOVER: { bg: '#FBE3E3', fg: '#E04545', label: 'W.O.' },
  PENDING: { bg: '#FDF1E3', fg: '#B86A12', label: 'Pendente' },
  ACCEPTED: { bg: '#E5F8F0', fg: '#1FB87A', label: 'Aceito' },
  REJECTED: { bg: '#FBE3E3', fg: '#E04545', label: 'Recusado' },
  COMPLETED: { bg: '#ECECF0', fg: '#3D2C52', label: 'Concluído' },
};

export function StatusBadge({ status, size = 'md' }: { status: AnyStatus; size?: 'sm' | 'md' }) {
  const c = colors[status] ?? { bg: '#ECECF0', fg: '#3D2C52', label: status };
  const fs = size === 'sm' ? 10 : 11;
  const py = size === 'sm' ? 'py-0.5' : 'py-1';
  return (
    <span
      className={`inline-flex items-center px-2 ${py} rounded-full uppercase`}
      style={{
        background: c.bg,
        color: c.fg,
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: fs,
        letterSpacing: 0.6,
      }}
    >
      {c.label}
    </span>
  );
}
