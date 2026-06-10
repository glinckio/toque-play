import { useState } from 'react';
import { Download, MoreHorizontal, Plus } from 'lucide-react';
import { adminUsers, userStatuses } from '../data';
import { FilterChip, GhostButton, Pill, PrimaryButton, Td, Th, Toolbar, TableShell } from '../ui';

export function AdminUsers() {
  const [filter, setFilter] = useState<'all' | 'PLAYER' | 'ORGANIZADOR' | 'SUPER_ADMIN'>('all');
  const filtered = adminUsers.filter((u) => filter === 'all' || u.role === filter);

  return (
    <div>
      <Toolbar>
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} count={adminUsers.length}>Todos</FilterChip>
        <FilterChip active={filter === 'PLAYER'} onClick={() => setFilter('PLAYER')} count={adminUsers.filter((u) => u.role === 'PLAYER').length}>Atletas</FilterChip>
        <FilterChip active={filter === 'ORGANIZADOR'} onClick={() => setFilter('ORGANIZADOR')} count={adminUsers.filter((u) => u.role === 'ORGANIZADOR').length}>Organizadores</FilterChip>
        <FilterChip active={filter === 'SUPER_ADMIN'} onClick={() => setFilter('SUPER_ADMIN')} count={adminUsers.filter((u) => u.role === 'SUPER_ADMIN').length}>Admins</FilterChip>
        <div className="flex-1" />
        <GhostButton><Download size={14} />Exportar</GhostButton>
        <PrimaryButton icon={<Plus size={14} />}>Novo usuário</PrimaryButton>
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Usuário</Th>
            <Th>Perfil</Th>
            <Th>Status</Th>
            <Th>Cadastro</Th>
            <Th>Último acesso</Th>
            <Th className="text-right">Ações</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u) => {
            const status = userStatuses[u.id] ?? 'ACTIVE';
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
                <Td><Pill tone={u.role === 'SUPER_ADMIN' ? 'warning' : u.role === 'ORGANIZADOR' ? 'info' : 'neutral'}>{u.role ?? 'PLAYER'}</Pill></Td>
                <Td>
                  <Pill tone={status === 'ACTIVE' ? 'success' : status === 'SUSPENDED' ? 'danger' : 'warning'}>
                    {status === 'ACTIVE' ? 'Ativo' : status === 'SUSPENDED' ? 'Suspenso' : 'Pendente'}
                  </Pill>
                </Td>
                <Td style={{ color: '#6B5B7E' }}>12/03/2026</Td>
                <Td style={{ color: '#6B5B7E' }}>há 2 horas</Td>
                <Td className="text-right">
                  <button className="size-8 rounded-lg hover:bg-[#F4EFFA] inline-flex items-center justify-center"><MoreHorizontal size={16} color="#6B5B7E" /></button>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>

      <div className="flex items-center justify-between mt-4" style={{ fontSize: 12, color: '#6B5B7E' }}>
        <span>Mostrando 1–{filtered.length} de {filtered.length}</span>
        <div className="flex items-center gap-1">
          <button className="px-3 h-8 rounded-lg border border-[#ECE6F4] bg-white">Anterior</button>
          <button className="px-3 h-8 rounded-lg bg-[#6D2EC0] text-white">1</button>
          <button className="px-3 h-8 rounded-lg border border-[#ECE6F4] bg-white">Próximo</button>
        </div>
      </div>
    </div>
  );
}
