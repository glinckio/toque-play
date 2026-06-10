import { useState } from 'react';
import { Eye } from 'lucide-react';
import { matches } from '../../data/mocks';
import { MatchStatus } from '../../data/types';
import { FilterChip, Pill, TableShell, Td, Th, Toolbar } from '../ui';

const statusInfo: Record<MatchStatus, { label: string; tone: any }> = {
  SCHEDULED: { label: 'Agendada', tone: 'info' },
  IN_PROGRESS: { label: 'Ao vivo', tone: 'success' },
  FINISHED: { label: 'Finalizada', tone: 'neutral' },
  WALKOVER: { label: 'W.O.', tone: 'warning' },
  CANCELLED: { label: 'Cancelada', tone: 'danger' },
};

export function AdminMatches() {
  const [filter, setFilter] = useState<'all' | MatchStatus>('all');
  const filtered = matches.filter((m) => filter === 'all' || m.status === filter);

  return (
    <div>
      <Toolbar>
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} count={matches.length}>Todas</FilterChip>
        <FilterChip active={filter === 'IN_PROGRESS'} onClick={() => setFilter('IN_PROGRESS')}>Ao vivo</FilterChip>
        <FilterChip active={filter === 'SCHEDULED'} onClick={() => setFilter('SCHEDULED')}>Agendadas</FilterChip>
        <FilterChip active={filter === 'FINISHED'} onClick={() => setFilter('FINISHED')}>Finalizadas</FilterChip>
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Partida</Th>
            <Th>Contexto</Th>
            <Th>Status</Th>
            <Th>Placar</Th>
            <Th>Árbitro</Th>
            <Th>Agendada</Th>
            <Th className="text-right">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => {
            const s = statusInfo[m.status];
            const setsA = m.sets.filter((x) => x.finished && x.scoreA > x.scoreB).length;
            const setsB = m.sets.filter((x) => x.finished && x.scoreB > x.scoreA).length;
            return (
              <tr key={m.id} className="hover:bg-[#FAFAFA]">
                <Td>
                  <div>
                    <p style={{ fontWeight: 700, color: '#150A1F' }}>{m.teamA.name} <span style={{ color: '#A89BBA', fontWeight: 500 }}>vs</span> {m.teamB.name}</p>
                    <p style={{ fontSize: 11, color: '#6B5B7E' }}>{m.label ?? 'Partida'} · #{m.id}</p>
                  </div>
                </Td>
                <Td><Pill tone={m.context === 'TOURNAMENT' ? 'info' : 'neutral'}>{m.context === 'TOURNAMENT' ? (m.tournamentName ?? 'Torneio') : 'Amistoso'}</Pill></Td>
                <Td><Pill tone={s.tone}>{s.label}</Pill></Td>
                <Td><span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.5 }}>{setsA}–{setsB}</span></Td>
                <Td style={{ color: '#3D2C52' }}>{m.refereeId ? 'Lucas Andrade' : <span style={{ color: '#A89BBA' }}>Não atribuído</span>}</Td>
                <Td style={{ color: '#6B5B7E' }}>{new Date(m.scheduledAt).toLocaleString('pt-BR')}</Td>
                <Td className="text-right">
                  <button className="size-8 rounded-lg hover:bg-[#F4EFFA] inline-flex items-center justify-center"><Eye size={15} color="#6B5B7E" /></button>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>
    </div>
  );
}
