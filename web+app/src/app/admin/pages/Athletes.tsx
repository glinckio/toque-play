import { useState } from 'react';
import { adminUsers } from '../data';
import { teams } from '../../data/mocks';
import { FilterChip, Pill, TableShell, Td, Th, Toolbar } from '../ui';

export function AdminAthletes() {
  const [modality, setModality] = useState<'all' | 'BEACH' | 'COURT'>('all');
  const players = adminUsers.filter((u) => !u.role || u.role === 'PLAYER');

  const stats = (uid: string) => {
    const t = teams.filter((tm) => tm.members.some((m) => m.userId === uid));
    return { teams: t.length, wins: t.reduce((s, x) => s + x.wins, 0), losses: t.reduce((s, x) => s + x.losses, 0) };
  };

  const filtered = players.filter((u) => {
    if (modality === 'all') return true;
    return teams.some((tm) => tm.modality === modality && tm.members.some((m) => m.userId === u.id));
  });

  return (
    <div>
      <Toolbar>
        <FilterChip active={modality === 'all'} onClick={() => setModality('all')} count={players.length}>Todos</FilterChip>
        <FilterChip active={modality === 'BEACH'} onClick={() => setModality('BEACH')}>Praia</FilterChip>
        <FilterChip active={modality === 'COURT'} onClick={() => setModality('COURT')}>Quadra</FilterChip>
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Atleta</Th>
            <Th>Times</Th>
            <Th>Vitórias</Th>
            <Th>Derrotas</Th>
            <Th>Aproveitamento</Th>
            <Th>Estado</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => {
            const s = stats(u.id);
            const rate = s.wins + s.losses > 0 ? Math.round((s.wins / (s.wins + s.losses)) * 100) : 0;
            return (
              <tr key={u.id} className="hover:bg-[#FAFAFA]">
                <Td>
                  <div className="flex items-center gap-3">
                    {u.avatarUrl ? <img src={u.avatarUrl} className="size-9 rounded-full object-cover" /> : <div className="size-9 rounded-full bg-[#F4EFFA]" />}
                    <div>
                      <p style={{ fontWeight: 700, color: '#150A1F' }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: '#6B5B7E' }}>{u.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>{s.teams}</Td>
                <Td style={{ color: '#1FB87A', fontWeight: 700 }}>{s.wins}</Td>
                <Td style={{ color: '#E04545', fontWeight: 700 }}>{s.losses}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[#F4EFFA] overflow-hidden">
                      <div className="h-full" style={{ width: `${rate}%`, background: 'linear-gradient(90deg,#6D2EC0,#A674F0)' }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 12 }}>{rate}%</span>
                  </div>
                </Td>
                <Td><Pill tone="success">Ativo</Pill></Td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>
    </div>
  );
}
