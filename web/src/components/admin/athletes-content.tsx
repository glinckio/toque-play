"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Volleyball } from "lucide-react";
import { api, type Paginated } from "@/lib/api/client";
import { initials } from "@/lib/utils";
import { EmptyState, Pill, Td, Th, TableShell, Toolbar } from "./ui";

interface AthleteStats {
  matchesPlayed: number;
  matchesWon: number;
  setsWon: number;
  pointsScored: number;
  mvpCount: number;
}

interface AdminAthlete {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  status: string;
  createdAt: string;
  teamsCount: number;
  stats: AthleteStats;
}

export function AthletesContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "athletes", { search, page }],
    queryFn: () =>
      api.get<Paginated<AdminAthlete>>("admin/athletes", {
        search: search || undefined,
        page,
        limit: 20,
      }),
  });

  const athletes = data?.data ?? [];

  return (
    <div>
      <Toolbar>
        <div className="relative w-[320px] max-w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar atleta por nome ou email"
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Atleta</Th>
            <Th>Status</Th>
            <Th>Times</Th>
            <Th>Partidas</Th>
            <Th>Vitórias</Th>
            <Th> Pontos </Th>
            <Th>MVPs</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <Td className="text-ink-500">Carregando…</Td>
              <Td /> <Td /> <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {isError && (
            <tr>
              <Td className="text-danger-fg">Falha ao carregar atletas.</Td>
              <Td /> <Td /> <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {!isLoading && athletes.length === 0 && (
            <tr>
              <Td colSpan={7}>
                <EmptyState title="Nenhum atleta encontrado" />
              </Td>
            </tr>
          )}
          {athletes.map((a) => (
            <tr key={a.id} className="hover:bg-brand-50/40">
              <Td>
                <div className="flex items-center gap-3">
                  {a.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.avatarUrl} alt={a.name} className="size-9 rounded-full object-cover" />
                  ) : (
                    <span className="size-9 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-700">
                      {initials(a.name)}
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-ink-900">{a.name}</p>
                    <p className="text-[11px] text-ink-500">{a.email}</p>
                  </div>
                </div>
              </Td>
              <Td>
                {a.status === "BLOCKED" ? (
                  <Pill tone="danger">Bloqueado</Pill>
                ) : (
                  <Pill tone="success">Ativo</Pill>
                )}
              </Td>
              <Td className="text-ink-700">{a.teamsCount}</Td>
              <Td className="text-ink-700">{a.stats.matchesPlayed}</Td>
              <Td className="text-ink-700">{a.stats.matchesWon}</Td>
              <Td className="text-ink-700">{a.stats.pointsScored}</Td>
              <Td>
                {a.stats.mvpCount > 0 ? (
                  <Pill tone="warning">{a.stats.mvpCount}</Pill>
                ) : (
                  <span className="text-ink-500">—</span>
                )}
              </Td>
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
