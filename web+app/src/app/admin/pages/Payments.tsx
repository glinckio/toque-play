import { useState } from 'react';
import { ArrowUpRight, Download, ExternalLink, RotateCcw } from 'lucide-react';
import { payments } from '../data';
import { Card, FilterChip, GhostButton, Pill, TableShell, Td, Th, Toolbar } from '../ui';

const brl = (cents: number) => `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

export function AdminPayments() {
  const [filter, setFilter] = useState<'all' | 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED'>('all');
  const filtered = payments.filter((p) => filter === 'all' || p.status === filter);

  const total = payments.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.amountCents, 0);
  const refunded = payments.filter((p) => p.status === 'REFUNDED').reduce((s, p) => s + p.amountCents, 0);
  const failed = payments.filter((p) => p.status === 'FAILED').length;
  const successRate = Math.round((payments.filter((p) => p.status === 'PAID').length / payments.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <SmallKpi label="Recebido" value={brl(total)} accent="#1FB87A" />
        <SmallKpi label="Reembolsado" value={brl(refunded)} accent="#E04545" />
        <SmallKpi label="Falhas" value={String(failed)} accent="#F0A030" />
        <SmallKpi label="Taxa de sucesso" value={`${successRate}%`} accent="#6D2EC0" />
      </div>

      <div>
        <Toolbar>
          <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} count={payments.length}>Todos</FilterChip>
          <FilterChip active={filter === 'PAID'} onClick={() => setFilter('PAID')}>Pagos</FilterChip>
          <FilterChip active={filter === 'PENDING'} onClick={() => setFilter('PENDING')}>Pendentes</FilterChip>
          <FilterChip active={filter === 'REFUNDED'} onClick={() => setFilter('REFUNDED')}>Reembolsados</FilterChip>
          <FilterChip active={filter === 'FAILED'} onClick={() => setFilter('FAILED')}>Falhas</FilterChip>
          <div className="flex-1" />
          <GhostButton><Download size={14} />Exportar CSV</GhostButton>
        </Toolbar>

        <TableShell>
          <thead>
            <tr>
              <Th>Stripe ID</Th>
              <Th>Cliente</Th>
              <Th>Torneio</Th>
              <Th>Valor</Th>
              <Th>Método</Th>
              <Th>Status</Th>
              <Th>Data</Th>
              <Th className="text-right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-[#FAFAFA]">
                <Td>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#F5F4F8]" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: '#3D2C52' }}>
                    {p.stripeId}<ExternalLink size={11} color="#A89BBA" />
                  </span>
                </Td>
                <Td>
                  <p style={{ fontWeight: 700, color: '#150A1F' }}>{p.user}</p>
                  <p style={{ fontSize: 11, color: '#6B5B7E' }}>{p.email}</p>
                </Td>
                <Td style={{ color: '#3D2C52' }}>{p.tournament}</Td>
                <Td style={{ fontWeight: 700 }}>{brl(p.amountCents)}</Td>
                <Td><Pill tone="neutral">{p.method === 'CARD' ? 'Cartão' : 'Pix'}</Pill></Td>
                <Td>
                  <Pill tone={p.status === 'PAID' ? 'success' : p.status === 'PENDING' ? 'warning' : p.status === 'REFUNDED' ? 'info' : 'danger'}>
                    {p.status === 'PAID' ? 'Pago' : p.status === 'PENDING' ? 'Pendente' : p.status === 'REFUNDED' ? 'Reembolsado' : 'Falhou'}
                  </Pill>
                </Td>
                <Td style={{ color: '#6B5B7E' }}>{new Date(p.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</Td>
                <Td className="text-right">
                  {p.status === 'PAID' && (
                    <button className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-[#ECE6F4] hover:bg-[#F4EFFA]" style={{ fontSize: 11, fontWeight: 700, color: '#6D2EC0' }}>
                      <RotateCcw size={12} />Reembolsar
                    </button>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </div>
    </div>
  );
}

function SmallKpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 11, color: '#6B5B7E', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
        <span className="size-2 rounded-full" style={{ background: accent }} />
      </div>
      <p className="mt-2" style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#150A1F', lineHeight: 1 }}>{value}</p>
    </Card>
  );
}
