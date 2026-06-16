"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Handshake, Plus, Search, Trash2 } from "lucide-react";
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
import { EmptyState, GhostButton, Pill, PrimaryButton, Td, Th, TableShell, Toolbar } from "./ui";
import { FilterBar, Chip } from "./filter-bar";
import { DateRangeFilter } from "./date-range-filter";

interface AdminFriendly {
  id: string;
  title?: string | null;
  status: string;
  date: string;
  startTime?: string | null;
  city?: string | null;
  state?: string | null;
  modality?: string | null;
  scoreTeamA?: number | null;
  scoreTeamB?: number | null;
  requester?: { id: string; name: string; email: string } | null;
  requesterTeam?: { id: string; name: string } | null;
  challenged?: { id: string; name: string; email: string } | null;
  challengedTeam?: { id: string; name: string } | null;
}

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "PENDING", label: "Pendentes" },
  { key: "ACCEPTED", label: "Aceitos" },
  { key: "COMPLETED", label: "Concluídos" },
  { key: "REJECTED", label: "Rejeitados" },
  { key: "CANCELLED", label: "Cancelados" },
];

export function FriendliesContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modality, setModality] = useState<"all" | "BEACH" | "COURT">("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "friendlies", { status, modality, dateRange, page }],
    queryFn: () =>
      api.get<Paginated<AdminFriendly>>("admin/friendlies", {
        search: search || undefined,
        status: status === "all" ? undefined : status,
        modality: modality === "all" ? undefined : modality,
        from: dateRange.from || undefined,
        to: dateRange.to || undefined,
        page,
        limit: 20,
      }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`admin/friendlies/${id}`),
    onSuccess: () => {
      toast.success("Amistoso removido");
      qc.invalidateQueries({ queryKey: ["admin", "friendlies"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const friendlies = data?.data ?? [];
  const filtered = search
    ? friendlies.filter((f) => f.title?.toLowerCase().includes(search.toLowerCase()))
    : friendlies;

  return (
    <div>
      <Toolbar>
        <div className="relative w-[320px] max-w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por título"
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
        <div className="flex-1" />
        <PrimaryButton icon={<Plus size={14} />} onClick={() => (window.location.href = "/friendlies/new")}>
          Novo amistoso
        </PrimaryButton>
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
            <Th>Amistoso</Th>
            <Th>Desafiante</Th>
            <Th>Desafiado</Th>
            <Th>Placar</Th>
            <Th>Status</Th>
            <Th>Data</Th>
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
              <Td className="text-danger-fg">Falha ao carregar.</Td>
              <Td /> <Td /> <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr>
              <Td colSpan={7}>
                <EmptyState title="Nenhum amistoso encontrado" />
              </Td>
            </tr>
          )}
          {filtered.map((f) => (
            <tr key={f.id} className="hover:bg-brand-50/40">
              <Td>
                <Link href={`/friendlies/${f.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="size-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Handshake size={16} color="#6D2EC0" />
                  </span>
                  <p className="font-bold text-ink-900 underline-offset-2 hover:underline">
                    {f.title ?? "Sem título"}
                  </p>
                </Link>
              </Td>
              <Td className="text-ink-700">
                <p>{f.requesterTeam?.name ?? f.requester?.name ?? "—"}</p>
                {f.requester && (
                  <p className="text-[11px] text-ink-500">{f.requester.email}</p>
                )}
              </Td>
              <Td className="text-ink-700">
                <p>{f.challengedTeam?.name ?? f.challenged?.name ?? "—"}</p>
              </Td>
              <Td className="text-ink-900 font-bold">
                {f.scoreTeamA != null && f.scoreTeamB != null
                  ? `${f.scoreTeamA} - ${f.scoreTeamB}`
                  : "—"}
              </Td>
              <Td>
                <FriendlyStatusPill status={f.status} />
              </Td>
              <Td className="text-ink-500">{formatDate(f.date)}</Td>
              <Td className="text-right">
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
                      <AlertDialogTitle>Excluir "{f.title ?? "amistoso"}"?</AlertDialogTitle>
                      <AlertDialogDescription>Ação permanente.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMut.mutate(f.id)}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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

function FriendlyStatusPill({ status }: { status: string }) {
  switch (status) {
    case "PENDING":
      return <Pill tone="warning">Pendente</Pill>;
    case "ACCEPTED":
      return <Pill tone="info">Aceito</Pill>;
    case "COMPLETED":
      return <Pill tone="success">Concluído</Pill>;
    case "REJECTED":
      return <Pill tone="danger">Rejeitado</Pill>;
    case "CANCELLED":
      return <Pill tone="neutral">Cancelado</Pill>;
    default:
      return <Pill>{status}</Pill>;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
}
