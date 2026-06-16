"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Swords } from "lucide-react";
import { api, type Paginated } from "@/lib/api/client";
import { useLiveMatches } from "@/lib/socket/use-live-matches";
import { EmptyState, Pill, Td, Th, TableShell, Toolbar } from "./ui";
import { FilterBar, Chip } from "./filter-bar";
import { DateRangeFilter } from "./date-range-filter";

interface AdminMatch {
  id: string;
  status: string;
  scheduledAt: string | null;
  scoreTeamA: number;
  scoreTeamB: number;
  round: number;
  label: string | null;
  teamA?: { id: string; name: string } | null;
  teamB?: { id: string; name: string } | null;
  winner?: { id: string; name: string } | null;
  bracket?: {
    id: string;
    tournamentId: string;
    tournament?: { id: string; name: string } | null;
  } | null;
  friendly?: {
    id: string;
    title?: string | null;
    requesterTeam?: { id: string; name: string } | null;
    challengedTeam?: { id: string; name: string } | null;
  } | null;
}

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "SCHEDULED", label: "Agendadas" },
  { key: "IN_PROGRESS", label: "Ao vivo" },
  { key: "FINISHED", label: "Finalizadas" },
  { key: "WALKOVER", label: "W.O." },
  { key: "CANCELLED", label: "Canceladas" },
];

export function MatchesContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState<"all" | "tournament" | "friendly">("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "matches", { status, type, dateRange, page }],
    queryFn: () =>
      api.get<Paginated<AdminMatch>>("admin/matches", {
        status: status === "all" ? undefined : status,
        type: type === "all" ? undefined : type,
        from: dateRange.from || undefined,
        to: dateRange.to || undefined,
        page,
        limit: 20,
      }),
  });

  const matches = data?.data ?? [];

  // Live updates: junctiona rooms dos torneios visíveis e invalida query em eventos.
  const tournamentIds = useMemo(
    () =>
      Array.from(
        new Set(
          matches
            .map((m) => m.bracket?.tournamentId)
            .filter((id): id is string => Boolean(id)),
        ),
      ),
    [matches],
  );
  useLiveMatches(tournamentIds);

  const filtered = search
    ? matches.filter((m) =>
        [
          m.teamA?.name,
          m.teamB?.name,
          m.bracket?.tournament?.name,
          m.friendly?.title,
        ].some((s) => s?.toLowerCase().includes(search.toLowerCase())),
      )
    : matches;

  return (
    <div>
      <div className="flex gap-1 bg-white border border-brand-100 rounded-xl p-1 mb-4 w-fit">
        {(
          [
            { key: "all", label: "Todas" },
            { key: "tournament", label: "Torneios" },
            { key: "friendly", label: "Amistosos" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => { setType(t.key); setPage(1); }}
            className={`px-4 h-9 rounded-lg text-sm font-semibold transition-colors ${
              type === t.key ? "bg-brand-500 text-white" : "text-ink-700 hover:bg-brand-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Toolbar>
        <div className="relative w-[320px] max-w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={type === "friendly" ? "Buscar por time ou amistoso" : "Buscar por time ou torneio"}
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
      </Toolbar>

      <FilterBar
        onClear={() => {
          setStatus("all");
          setDateRange({ from: "", to: "" });
          setPage(1);
        }}
        groups={[
          {
            label: "Status",
            active: status !== "all",
            children: STATUS_FILTERS.map((f) => (
              <Chip key={f.key} active={status === f.key} onClick={() => { setStatus(f.key); setPage(1); }}>
                {f.label}
              </Chip>
            )),
          },
          {
            label: "Período",
            active: Boolean(dateRange.from || dateRange.to),
            children: (
              <DateRangeFilter
                from={dateRange.from}
                to={dateRange.to}
                onChange={(r) => { setDateRange(r); setPage(1); }}
              />
            ),
          },
        ]}
      />

      <TableShell>
        <thead>
          <tr>
            <Th>Partida</Th>
            <Th>Evento</Th>
            <Th>Placar</Th>
            <Th>Status</Th>
            <Th>Início</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <Td className="text-ink-500">Carregando…</Td>
              <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {isError && (
            <tr>
              <Td className="text-danger-fg">Falha ao carregar partidas.</Td>
              <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr>
              <Td colSpan={5}>
                <EmptyState title="Nenhuma partida encontrada" />
              </Td>
            </tr>
          )}
          {filtered.map((m) => (
            <tr key={m.id} className="hover:bg-brand-50/40">
              <Td>
                <Link href={`/matches/${m.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="size-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Swords size={16} color="#6D2EC0" />
                  </span>
                  <div>
                    <p className="font-bold text-ink-900 underline-offset-2 hover:underline">
                      {m.teamA?.name ?? "—"} vs {m.teamB?.name ?? "—"}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {m.label ? `${m.label} · ` : ""}Rodada {m.round}
                    </p>
                  </div>
                </Link>
              </Td>
              <Td className="text-ink-700">
                {m.bracket?.tournament?.name ? (
                  <div>
                    <p>{m.bracket.tournament.name}</p>
                    <span className="text-[10px] text-ink-300 uppercase">Torneio</span>
                  </div>
                ) : m.friendly ? (
                  <div>
                    <p>{m.friendly.title ?? "Amistoso"}</p>
                    <span className="text-[10px] text-ink-300 uppercase">Amistoso</span>
                  </div>
                ) : (
                  "—"
                )}
              </Td>
              <Td className="text-ink-900 font-bold">
                {m.scoreTeamA} - {m.scoreTeamB}
              </Td>
              <Td>
                <MatchStatusPill status={m.status} />
              </Td>
              <Td className="text-ink-500">{formatDateTime(m.scheduledAt)}</Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-ink-500">
          <span>Página {page} de {data.totalPages}</span>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 h-8 rounded-lg border border-brand-100 bg-white disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
            className="px-3 h-8 rounded-lg border border-brand-100 bg-white disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

function MatchStatusPill({ status }: { status: string }) {
  switch (status) {
    case "SCHEDULED":
      return <Pill tone="neutral">Agendada</Pill>;
    case "IN_PROGRESS":
      return <Pill tone="success">Ao vivo</Pill>;
    case "FINISHED":
      return <Pill tone="info">Finalizada</Pill>;
    case "WALKOVER":
      return <Pill tone="warning">W.O.</Pill>;
    case "CANCELLED":
      return <Pill tone="danger">Cancelada</Pill>;
    default:
      return <Pill>{status}</Pill>;
  }
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
