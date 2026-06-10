import { useState } from 'react';
import { Eye, MoreHorizontal, Plus } from 'lucide-react';
import { tournaments } from '../../data/mocks';
import { TournamentStatus } from '../../data/types';
import { FilterChip, Pill, PrimaryButton, TableShell, Td, Th, Toolbar } from '../ui';

const statusLabel: Record<TournamentStatus, { label: string; tone: any }> = {
  DRAFT: { label: 'Rascunho', tone: 'neutral' },
  PUBLISHED: { label: 'Publicado', tone: 'info' },
  REGISTRATION_OPEN: { label: 'Inscrições abertas', tone: 'success' },
  REGISTRATION_CLOSED: { label: 'Inscrições fechadas', tone: 'warning' },
  BRACKET_GENERATED: { label: 'Chaves geradas', tone: 'info' },
  IN_PROGRESS: { label: 'Em andamento', tone: 'success' },
  FINISHED: { label: 'Finalizado', tone: 'neutral' },
  CANCELLED: { label: 'Cancelado', tone: 'danger' },
};

export function AdminTournaments() {
  const [filter, setFilter] = useState<'all' | 'live' | 'draft' | 'finished'>('all');
  const filtered = tournaments.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'draft') return t.status === 'DRAFT';
    if (filter === 'finished') return t.status === 'FINISHED' || t.status === 'CANCELLED';
    return ['PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'BRACKET_GENERATED', 'IN_PROGRESS'].includes(t.status);
  });

  return (
    <div>
      <Toolbar>
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} count={tournaments.length}>Todos</FilterChip>
        <FilterChip active={filter === 'live'} onClick={() => setFilter('live')}>Ativos</FilterChip>
        <FilterChip active={filter === 'draft'} onClick={() => setFilter('draft')}>Rascunho</FilterChip>
        <FilterChip active={filter === 'finished'} onClick={() => setFilter('finished')}>Finalizados</FilterChip>
        <div className="flex-1" />
        <PrimaryButton icon={<Plus size={14} />}>Criar torneio</PrimaryButton>
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Torneio</Th>
            <Th>Organizador</Th>
            <Th>Modalidade</Th>
            <Th>Status</Th>
            <Th>Inscrições</Th>
            <Th>Receita</Th>
            <Th className="text-right">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => {
            const totalRegs = t.categories.reduce((s, c) => s + (c.registrationsCount ?? 0), 0);
            const totalRev = t.categories.reduce((s, c) => s + (c.registrationsCount ?? 0) * (c.registrationPrice ?? 0), 0);
            const s = statusLabel[t.status];
            return (
              <tr key={t.id} className="hover:bg-[#FAFAFA]">
                <Td>
                  <div className="flex items-center gap-3">
                    {t.coverUrl ? <img src={t.coverUrl} className="w-12 h-9 rounded-lg object-cover" /> : <div className="w-12 h-9 rounded-lg" style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} />}
                    <div>
                      <p style={{ fontWeight: 700, color: '#150A1F' }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: '#6B5B7E' }}>{t.city}/{t.state} · {new Date(t.startDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </Td>
                <Td style={{ color: '#3D2C52' }}>{t.organizer.name}</Td>
                <Td><Pill tone={t.modality === 'BEACH' ? 'warning' : 'info'}>{t.modality === 'BEACH' ? 'Praia' : 'Quadra'}</Pill></Td>
                <Td><Pill tone={s.tone}>{s.label}</Pill></Td>
                <Td style={{ fontWeight: 700 }}>{totalRegs}</Td>
                <Td style={{ fontWeight: 700, color: '#1FB87A' }}>R$ {totalRev.toLocaleString('pt-BR')}</Td>
                <Td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <button className="size-8 rounded-lg hover:bg-[#F4EFFA] inline-flex items-center justify-center"><Eye size={15} color="#6B5B7E" /></button>
                    <button className="size-8 rounded-lg hover:bg-[#F4EFFA] inline-flex items-center justify-center"><MoreHorizontal size={16} color="#6B5B7E" /></button>
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>
    </div>
  );
}
