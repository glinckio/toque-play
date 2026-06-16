"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, Trophy, Users, Volleyball } from "lucide-react";
import { brl } from "@/lib/utils";
import { Card, CardHeader, EmptyState, Kpi } from "./ui";
import type { AdminDashboard } from "@/lib/api/admin";

export function DashboardContent({ data }: { data: AdminDashboard | null }) {
  if (!data) {
    return (
      <EmptyState
        title="Não foi possível carregar o dashboard"
        hint="Verifique se o backend está disponível em http://localhost:3000"
      />
    );
  }

  const tournamentsActive =
    (data.tournamentsByStatus?.REGISTRATION_OPEN ?? 0) +
    (data.tournamentsByStatus?.IN_PROGRESS ?? 0) +
    (data.tournamentsByStatus?.ONGOING ?? 0);

  const revenue = data.revenue30dCents ?? 0;
  const revenueSeries = data.revenueByMonth ?? [];
  const regSeries = data.registrationsByDay ?? [];
  const rolesSeries = data.usersByRole ?? [];
  const modalitySeries = data.modalityBreakdown ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Receita 30d"
          value={brl(revenue)}
          icon={<DollarSign size={16} color="#6D2EC0" />}
        />
        <Kpi
          label="Usuários totais"
          value={data.totalUsers.toLocaleString("pt-BR")}
          icon={<Users size={16} color="#6D2EC0" />}
        />
        <Kpi
          label="Torneios ativos"
          value={String(tournamentsActive)}
          icon={<Trophy size={16} color="#6D2EC0" />}
        />
        <Kpi
          label="Partidas"
          value={data.totalMatches.toLocaleString("pt-BR")}
          icon={<Volleyball size={16} color="#6D2EC0" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <Header title="Receita" sub="Últimos meses · Inscrições pagas" />
          {revenueSeries.length > 0 ? (
            <Chart height={260}>
              <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6D2EC0" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6D2EC0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F4EFFA" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B5B7E" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6B5B7E" }}
                  tickFormatter={(v) => `R$ ${(Number(v) / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #ECE6F4", fontSize: 12 }}
                  formatter={(v) => brl(Number(v) * 100)}
                />
                <Area type="monotone" dataKey="value" stroke="#6D2EC0" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </Chart>
          ) : (
            <EmptyState title="Sem dados de receita" hint="Backend não retornou séries mensais." />
          )}
        </Card>

        <Card className="p-5">
          <Header title="Usuários por perfil" sub="Distribuição atual" />
          {rolesSeries.length > 0 ? (
            <>
              <Chart height={170}>
                <PieChart>
                  <Pie data={rolesSeries} dataKey="value" innerRadius={50} outerRadius={72} paddingAngle={2}>
                    {rolesSeries.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECE6F4", fontSize: 12 }} />
                </PieChart>
              </Chart>
              <div className="space-y-1.5 mt-1">
                {rolesSeries.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-xs text-ink-700">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ background: r.color }} />
                      {r.name}
                    </span>
                    <span className="font-bold">{r.value.toLocaleString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="Sem distribuição" />
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <Header title="Inscrições por dia" sub="Últimos 7 dias" />
          {regSeries.length > 0 ? (
            <Chart height={200}>
              <BarChart data={regSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#F4EFFA" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B5B7E" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B5B7E" }} />
                <Tooltip
                  cursor={{ fill: "#F4EFFA" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #ECE6F4", fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#6D2EC0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </Chart>
          ) : (
            <EmptyState title="Sem inscrições recentes" />
          )}
        </Card>

        <Card className="p-5">
          <Header title="Modalidade" sub="Torneios ativos" />
          {modalitySeries.length > 0 ? (
            <>
              <Chart height={160}>
                <PieChart>
                  <Pie data={modalitySeries} dataKey="value" innerRadius={42} outerRadius={68}>
                    {modalitySeries.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECE6F4", fontSize: 12 }} />
                </PieChart>
              </Chart>
              <div className="space-y-1.5">
                {modalitySeries.map((r) => (
                  <div key={r.name} className="flex items-center justify-between text-xs text-ink-700">
                    <span className="inline-flex items-center gap-2">
                      <span className="size-2.5 rounded-full" style={{ background: r.color }} />
                      {r.name}
                    </span>
                    <span className="font-bold">{r.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="Sem modalidades" />
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="Resumo operacional" />
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-hairline">
          <Metric label="Usuários ativos 30d" value={data.activeUsersLast30d.toLocaleString("pt-BR")} />
          <Metric label="Times" value={data.totalTeams.toLocaleString("pt-BR")} />
          <Metric label="Partidas" value={data.totalMatches.toLocaleString("pt-BR")} />
          <Metric
            label="Torneios (todos)"
            value={Object.values(data.tournamentsByStatus ?? {})
              .reduce((s, v) => s + v, 0)
              .toLocaleString("pt-BR")}
          />
        </div>
      </Card>
    </div>
  );
}

function Header({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <p className="font-display text-base text-ink-900">{title.toUpperCase()}</p>
      {sub && <p className="text-[11px] text-ink-500">{sub}</p>}
    </div>
  );
}

function Chart({ height, children }: { height: number; children: React.ReactNode }) {
  return (
    <div className="mt-4" style={{ height }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-5">
      <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">{label}</p>
      <p className="font-display text-2xl text-ink-900 mt-1">{value}</p>
    </div>
  );
}
