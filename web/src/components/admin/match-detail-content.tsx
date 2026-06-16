"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useLiveMatch } from "@/lib/socket/use-live-match";
import type { MatchDetail } from "@/app/(admin)/matches/[id]/page";
import { Card, CardHeader, Pill } from "./ui";
import { Activity, Crown, Trophy } from "lucide-react";

export function MatchDetailContent({ initial }: { initial: MatchDetail }) {
  const { data } = useQuery({
    queryKey: ["admin", "match", initial.id],
    queryFn: () => api.get<MatchDetail>(`admin/matches/${initial.id}`),
    initialData: initial,
    staleTime: 5_000,
  });

  useLiveMatch(data?.id ?? null);

  const match = data ?? initial;
  const isLive = match.status === "IN_PROGRESS";

  return (
    <div className="space-y-4">
      <Scoreboard match={match} isLive={isLive} />

      {match.sets.length > 0 && <SetsGrid match={match} />}

      <Timeline match={match} />
    </div>
  );
}

function Scoreboard({ match, isLive }: { match: MatchDetail; isLive: boolean }) {
  const teamA = match.teamA;
  const teamB = match.teamB;
  const aWon = match.winner?.id && match.winner.id === teamA?.id;
  const bWon = match.winner?.id && match.winner.id === teamB?.id;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-center gap-6">
        <TeamSide name={teamA?.name ?? "—"} score={match.scoreTeamA} won={!!aWon} />

        <div className="text-center">
          <p className="text-[11px] uppercase tracking-wider font-bold text-ink-500">VS</p>
          {isLive && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-danger-bg text-danger-fg text-[10px] font-bold">
              <span className="size-1.5 rounded-full bg-danger animate-pulse" /> AO VIVO
            </span>
          )}
          {match.status === "FINISHED" && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-success-bg text-success-fg text-[10px] font-bold">
              <Trophy size={10} /> FINALIZADA
            </span>
          )}
        </div>

        <TeamSide name={teamB?.name ?? "—"} score={match.scoreTeamB} won={!!bWon} reverse />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-ink-500 text-center">
        <Info label="Início" value={formatDateTime(match.scheduledAt)} />
        <Info label="Começou" value={formatDateTime(match.startedAt)} />
        <Info label="Terminou" value={formatDateTime(match.finishedAt)} />
      </div>
    </Card>
  );
}

function TeamSide({ name, score, won, reverse }: { name: string; score: number; won: boolean; reverse?: boolean }) {
  return (
    <div className={`flex-1 ${reverse ? "text-right" : "text-left"}`}>
      <div className={`flex items-center gap-2 ${reverse ? "justify-end" : ""}`}>
        {won && !reverse && <Crown size={16} color="#F0A030" />}
        <p className="font-display text-base text-ink-900 truncate">{name}</p>
        {won && reverse && <Crown size={16} color="#F0A030" />}
      </div>
      <p className={`font-display text-6xl text-ink-900 mt-2 ${won ? "" : "opacity-60"}`}>{score}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">{label}</p>
      <p className="text-sm font-semibold text-ink-900">{value}</p>
    </div>
  );
}

function SetsGrid({ match }: { match: MatchDetail }) {
  return (
    <Card>
      <CardHeader title="Sets" />
      <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-3">
        {match.sets.map((s) => {
          const aWon = s.scoreA > s.scoreB;
          return (
            <div
              key={s.id}
              className="rounded-xl border border-brand-100 p-3 text-center"
            >
              <p className="text-[10px] uppercase font-bold text-ink-500">Set {s.setNumber}</p>
              <p className={`mt-1 font-display text-2xl ${aWon ? "text-brand-700" : "text-ink-700"}`}>
                {s.scoreA}
              </p>
              <p className="text-[10px] text-ink-500">—</p>
              <p className={`font-display text-2xl ${!aWon ? "text-brand-700" : "text-ink-700"}`}>
                {s.scoreB}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Timeline({ match }: { match: MatchDetail }) {
  const events = [...match.matchEvents].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader title="Linha do tempo" />
        <div className="p-5 text-center text-sm text-ink-500">
          <Activity size={20} className="mx-auto mb-2 opacity-40" />
          Sem eventos registrados.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={`Linha do tempo (${events.length})`} />
      <ol className="p-5 space-y-3">
        {events.map((ev) => (
          <li key={ev.id} className="flex items-start gap-3">
            <span className="mt-0.5">{eventIcon(ev.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink-900 font-semibold">{eventLabel(ev.type, ev.team)}</p>
              <div className="flex items-center gap-3 text-[11px] text-ink-500 mt-0.5">
                {ev.setNumber != null && <span>Set {ev.setNumber}</span>}
                {ev.scoreA != null && ev.scoreB != null && (
                  <span className="font-bold text-ink-700">
                    {ev.scoreA} - {ev.scoreB}
                  </span>
                )}
                <span>{formatRelative(ev.createdAt)}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function eventIcon(type: string) {
  switch (type) {
    case "POINT":
      return <span className="size-6 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center text-[10px] font-bold">P</span>;
    case "MATCH_START":
      return <span className="size-6 rounded-full bg-info-bg text-info-fg inline-flex items-center justify-center text-[10px] font-bold">▶</span>;
    case "SET_FINISH":
      return <span className="size-6 rounded-full bg-success-bg text-success-fg inline-flex items-center justify-center text-[10px] font-bold">✓</span>;
    case "MATCH_FINISH":
      return <Trophy size={18} color="#F0A030" />;
    case "WALKOVER":
      return <span className="size-6 rounded-full bg-warning-bg text-warning-fg inline-flex items-center justify-center text-[10px] font-bold">W</span>;
    case "SIDE_SWITCH":
      return <span className="size-6 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center text-[10px] font-bold">⇄</span>;
    case "TIMEOUT":
      return <span className="size-6 rounded-full bg-warning-bg text-warning-fg inline-flex items-center justify-center text-[10px] font-bold">T</span>;
    case "SUBSTITUTION":
      return <span className="size-6 rounded-full bg-info-bg text-info-fg inline-flex items-center justify-center text-[10px] font-bold">↔</span>;
    default:
      return <span className="size-6 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center text-[10px]">•</span>;
  }
}

function eventLabel(type: string, team: string | null): string {
  const side = team ? (team === "A" ? "Time A" : "Time B") : "";
  switch (type) {
    case "POINT":
      return `Ponto para ${side || "time"}`;
    case "MATCH_START":
      return "Partida iniciada";
    case "SET_FINISH":
      return "Set finalizado";
    case "MATCH_FINISH":
      return "Partida finalizada";
    case "WALKOVER":
      return "W.O.";
    case "SIDE_SWITCH":
      return "Troca de lado";
    case "TIMEOUT":
      return "Tempo pedido";
    case "SUBSTITUTION":
      return "Substituição";
    default:
      return type;
  }
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
