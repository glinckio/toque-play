import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCircle, CreditCard, DollarSign, RotateCcw, Trophy, User as UserIcon, Users, Volleyball } from 'lucide-react';
import { adminMetrics, modalityBreakdown, recentActivity, registrationsByDay, revenueByMonth, usersByRole } from '../data';
import { Card, CardHeader, Kpi, Pill } from '../ui';

const brl = (cents: number) => `R$ ${(cents / 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Kpi label="Receita 30d" value={brl(adminMetrics.revenue30dCents)} delta={22} icon={<DollarSign size={16} color="#6D2EC0" />} />
        <Kpi label="Usuários ativos" value={adminMetrics.totalUsers.toLocaleString('pt-BR')} delta={6} icon={<Users size={16} color="#6D2EC0" />} />
        <Kpi label="Torneios ativos" value={String(adminMetrics.activeTournaments)} delta={11} icon={<Trophy size={16} color="#6D2EC0" />} />
        <Kpi label="Partidas 30d" value={adminMetrics.matchesPlayed30d.toLocaleString('pt-BR')} delta={-3} icon={<Volleyball size={16} color="#6D2EC0" />} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.6 }}>RECEITA</p>
              <p style={{ fontSize: 11, color: '#6B5B7E' }}>Últimos 6 meses · Inscrições pagas via Stripe</p>
            </div>
            <div className="flex items-center gap-4" style={{ fontSize: 11, color: '#6B5B7E' }}>
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#6D2EC0]" />Pago</span>
            </div>
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D2EC0" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6D2EC0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F4EFFA" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B5B7E' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B5B7E' }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ECE6F4', fontSize: 12 }} formatter={(v: any) => brl(v * 100)} />
                <Area type="monotone" dataKey="value" stroke="#6D2EC0" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.6 }}>USUÁRIOS POR PERFIL</p>
          <p style={{ fontSize: 11, color: '#6B5B7E' }}>Distribuição atual</p>
          <div className="mt-2 h-[170px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={usersByRole} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={2}>
                  {usersByRole.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ECE6F4', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-1">
            {usersByRole.map((r) => (
              <div key={r.name} className="flex items-center justify-between" style={{ fontSize: 12, color: '#3D2C52' }}>
                <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: r.color }} />{r.name}</span>
                <span style={{ fontWeight: 700 }}>{r.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.6 }}>INSCRIÇÕES POR DIA</p>
          <p style={{ fontSize: 11, color: '#6B5B7E' }}>Últimos 7 dias</p>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer>
              <BarChart data={registrationsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#F4EFFA" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B5B7E' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B5B7E' }} />
                <Tooltip cursor={{ fill: '#F4EFFA' }} contentStyle={{ borderRadius: 12, border: '1px solid #ECE6F4', fontSize: 12 }} />
                <Bar dataKey="value" fill="#6D2EC0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.6 }}>MODALIDADE</p>
          <p style={{ fontSize: 11, color: '#6B5B7E' }}>Torneios ativos</p>
          <div className="mt-2 h-[160px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={modalityBreakdown} dataKey="value" innerRadius={42} outerRadius={68}>
                  {modalityBreakdown.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ECE6F4', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {modalityBreakdown.map((r) => (
              <div key={r.name} className="flex items-center justify-between" style={{ fontSize: 12, color: '#3D2C52' }}>
                <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: r.color }} />{r.name}</span>
                <span style={{ fontWeight: 700 }}>{r.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader title="Atividade recente" action={<button style={{ fontSize: 12, color: '#6D2EC0', fontWeight: 700 }}>Ver tudo</button>} />
          <ul>
            {recentActivity.map((a) => (
              <li key={a.id} className="px-5 py-3 border-b border-[#F4EFFA] last:border-b-0 flex items-center gap-3">
                <span className="size-9 rounded-xl flex items-center justify-center" style={{ background: a.kind === 'REFUND' ? '#FDECEC' : a.kind === 'DISPUTE' ? '#FFF3DE' : '#F4EFFA' }}>
                  {a.kind === 'PAYMENT' && <CreditCard size={15} color="#6D2EC0" />}
                  {a.kind === 'TOURNAMENT' && <Trophy size={15} color="#6D2EC0" />}
                  {a.kind === 'REFUND' && <RotateCcw size={15} color="#E04545" />}
                  {a.kind === 'USER' && <UserIcon size={15} color="#6D2EC0" />}
                  {a.kind === 'MATCH' && <Volleyball size={15} color="#6D2EC0" />}
                  {a.kind === 'DISPUTE' && <AlertCircle size={15} color="#F0A030" />}
                </span>
                <p className="flex-1" style={{ fontSize: 13, color: '#150A1F' }}>{a.text}</p>
                <span style={{ fontSize: 11, color: '#A89BBA' }}>há {a.at}</span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.8 }}>ALERTAS</p>
            <div className="mt-3 space-y-3">
              <AlertRow icon={<AlertCircle size={16} color="#F0A030" />} title="3 reembolsos abertos" sub="Aguardando aprovação manual" tone="warning" />
              <AlertRow icon={<AlertCircle size={16} color="#E04545" />} title="1 disputa Stripe" sub="pi_3OabA1B2C3 — chargeback" tone="danger" />
              <AlertRow icon={<UserIcon size={16} color="#1FB87A" />} title="14 inscrições pendentes" sub="Pagamento aguardando confirmação" tone="success" />
            </div>
          </Card>
          <Card className="p-5" >
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.8 }}>SAÚDE DO STRIPE</p>
            <div className="mt-3 space-y-2.5">
              <KV k="Sucesso 24h" v="98.7%" tone="success" />
              <KV k="Tempo médio" v="1.2s" />
              <KV k="Webhooks com falha" v="0" tone="success" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ icon, title, sub, tone }: { icon: any; title: string; sub: string; tone: 'warning' | 'danger' | 'success' }) {
  const bg = tone === 'warning' ? '#FFF8EC' : tone === 'danger' ? '#FDECEC' : '#E6F8EF';
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: bg }}>
      {icon}
      <div className="flex-1">
        <p style={{ fontSize: 13, fontWeight: 700, color: '#150A1F' }}>{title}</p>
        <p style={{ fontSize: 11, color: '#6B5B7E' }}>{sub}</p>
      </div>
    </div>
  );
}

function KV({ k, v, tone }: { k: string; v: string; tone?: 'success' }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontSize: 12, color: '#6B5B7E' }}>{k}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: tone === 'success' ? '#1FB87A' : '#150A1F' }}>{v}</span>
    </div>
  );
}
