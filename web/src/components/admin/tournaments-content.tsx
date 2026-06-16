"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Search, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { api, type Paginated } from "@/lib/api/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState, Pill, Td, Th, TableShell, Toolbar } from "./ui";
import { FilterBar, Chip } from "./filter-bar";
import { DateRangeFilter } from "./date-range-filter";

interface AdminTournament {
  id: string;
  name: string;
  status: string;
  modality?: string;
  startDate?: string;
  owner?: { id: string; name: string; email: string };
  _count?: { registrations: number; brackets: number };
}

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "DRAFT", label: "Rascunho" },
  { key: "REGISTRATION_OPEN", label: "Inscrições abertas" },
  { key: "IN_PROGRESS", label: "Em andamento" },
  { key: "COMPLETED", label: "Concluídos" },
  { key: "CANCELLED", label: "Cancelados" },
];

export function TournamentsContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modality, setModality] = useState<"all" | "BEACH" | "COURT">("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "tournaments", { status, modality, dateRange, page }],
    queryFn: () =>
      api.get<Paginated<AdminTournament>>("admin/tournaments", {
        search: search || undefined,
        status: status === "all" ? undefined : status,
        modality: modality === "all" ? undefined : modality,
        from: dateRange.from || undefined,
        to: dateRange.to || undefined,
        page,
        limit: 20,
      }),
  });

  const blockMut = useMutation({
    mutationFn: (id: string) => api.patch(`admin/tournaments/${id}/block`),
    onSuccess: () => {
      toast.success("Torneio bloqueado");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`admin/tournaments/${id}`),
    onSuccess: () => {
      toast.success("Torneio removido");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const tournaments = data?.data ?? [];

  const filtered = search
    ? tournaments.filter((t) =>
        [t.name, t.owner?.name, t.owner?.email].some((s) => s?.toLowerCase().includes(search.toLowerCase())),
      )
    : tournaments;

  return (
    <div>
      <Toolbar>
        <div className="relative w-[320px] max-w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar torneio ou organizador"
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
        <div className="flex-1" />
        <button
          onClick={() => (window.location.href = "/tournaments/new")}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl text-white hover:opacity-95"
          style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)", fontSize: 13, fontWeight: 700 }}
        >
          + Novo torneio
        </button>
      </Toolbar>

      <FilterBar
        onClear={() => {
          setStatus("all");
          setModality("all");
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
            label: "Modalidade",
            active: modality !== "all",
            children: (
              <>
                <Chip active={modality === "all"} onClick={() => { setModality("all"); setPage(1); }}>Todas</Chip>
                <Chip active={modality === "BEACH"} onClick={() => { setModality("BEACH"); setPage(1); }}>Praia</Chip>
                <Chip active={modality === "COURT"} onClick={() => { setModality("COURT"); setPage(1); }}>Quadra</Chip>
              </>
            ),
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
            <Th>Torneio</Th>
            <Th>Organizador</Th>
            <Th>Modalidade</Th>
            <Th>Inscrições</Th>
            <Th>Status</Th>
            <Th>Início</Th>
            <Th className="text-right">Ações</Th>
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
              <Td className="text-danger-fg">Falha ao carregar torneios.</Td>
              <Td /> <Td /> <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr>
              <Td colSpan={7}>
                <EmptyState title="Nenhum torneio encontrado" />
              </Td>
            </tr>
          )}
          {filtered.map((t) => (
            <tr key={t.id} className="hover:bg-brand-50/40">
              <Td>
                <Link href={`/tournaments/${t.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="size-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Trophy size={16} color="#6D2EC0" />
                  </span>
                  <p className="font-bold text-ink-900 underline-offset-2 hover:underline">{t.name}</p>
                </Link>
              </Td>
              <Td className="text-ink-700">
                {t.owner ? (
                  <div>
                    <p className="font-semibold">{t.owner.name}</p>
                    <p className="text-[11px] text-ink-500">{t.owner.email}</p>
                  </div>
                ) : (
                  "—"
                )}
              </Td>
              <Td className="text-ink-700">{t.modality ?? "—"}</Td>
              <Td className="text-ink-700">{t._count?.registrations ?? 0}</Td>
              <Td>
                <TournamentStatusPill status={t.status} />
              </Td>
              <Td className="text-ink-500">{formatDate(t.startDate)}</Td>
              <Td className="text-right">
                <div className="inline-flex gap-1">
                  {t.status !== "CANCELLED" && (
                    <button
                      onClick={() => blockMut.mutate(t.id)}
                      disabled={blockMut.isPending}
                      title="Bloquear / cancelar"
                      className="size-8 rounded-lg hover:bg-warning-bg inline-flex items-center justify-center disabled:opacity-50"
                    >
                      <Ban size={15} color="#A05E00" />
                    </button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <button
                          title="Excluir"
                          className="size-8 rounded-lg hover:bg-danger-bg inline-flex items-center justify-center"
                        >
                          <Trash2 size={15} color="#E04545" />
                        </button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir "{t.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A ação remove (soft delete) o torneio da plataforma. Não pode ser desfeita pelo painel.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMut.mutate(t.id)}>
                          Confirmar exclusão
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-ink-500">
          <span>
            Página {page} de {data.totalPages}
          </span>
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

function TournamentStatusPill({ status }: { status: string }) {
  switch (status) {
    case "DRAFT":
      return <Pill tone="neutral">Rascunho</Pill>;
    case "REGISTRATION_OPEN":
      return <Pill tone="info">Inscrições abertas</Pill>;
    case "IN_PROGRESS":
    case "ONGOING":
      return <Pill tone="success">Em andamento</Pill>;
    case "COMPLETED":
      return <Pill tone="neutral">Concluído</Pill>;
    case "CANCELLED":
      return <Pill tone="danger">Cancelado</Pill>;
    default:
      return <Pill>{status}</Pill>;
  }
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
}
