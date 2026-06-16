"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, RotateCcw, Search } from "lucide-react";
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
import { brl } from "@/lib/utils";
import { EmptyState, FilterChip, Pill, Td, Th, TableShell, Toolbar } from "./ui";

interface AdminPayment {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  tournamentId: string;
  tournamentName: string | null;
  categoryLabel: string | null;
  teamId: string;
  teamName: string | null;
  status: string;
  paymentId: string | null;
  paymentStatus: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  createdAt: string;
}

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "PAID", label: "Pagos" },
  { key: "PENDING", label: "Pendentes" },
  { key: "REFUNDED", label: "Reembolsados" },
  { key: "FAILED", label: "Falhados" },
];

export function PaymentsContent() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "payments", { status, page }],
    queryFn: () =>
      api.get<Paginated<AdminPayment>>("admin/payments", {
        status: status === "all" ? undefined : status,
        page,
        limit: 20,
      }),
  });

  const refundMut = useMutation({
    mutationFn: (id: string) => api.post(`admin/payments/${id}/refund`),
    onSuccess: () => {
      toast.success("Reembolso processado");
      qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payments = data?.data ?? [];
  const filtered = search
    ? payments.filter((p) =>
        [p.userName, p.userEmail, p.paymentId, p.tournamentName].some((s) =>
          s?.toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : payments;

  return (
    <div>
      <Toolbar>
        <div className="relative w-[320px] max-w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por usuário, email ou Stripe ID"
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
        {STATUS_FILTERS.map((f) => (
          <FilterChip key={f.key} active={status === f.key} onClick={() => { setStatus(f.key); setPage(1); }}>
            {f.label}
          </FilterChip>
        ))}
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Usuário</Th>
            <Th>Torneio</Th>
            <Th>Stripe ID</Th>
            <Th>Método</Th>
            <Th>Status</Th>
            <Th>Pago em</Th>
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
              <Td className="text-danger-fg">Falha ao carregar pagamentos.</Td>
              <Td /> <Td /> <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr>
              <Td colSpan={7}>
                <EmptyState title="Nenhum pagamento encontrado" />
              </Td>
            </tr>
          )}
          {filtered.map((p) => (
            <tr key={p.id} className="hover:bg-brand-50/40">
              <Td>
                <div className="flex items-center gap-3">
                  <span className="size-9 rounded-xl bg-brand-50 flex items-center justify-center">
                    <CreditCard size={16} color="#6D2EC0" />
                  </span>
                  <div>
                    <p className="font-bold text-ink-900">{p.userName ?? "—"}</p>
                    <p className="text-[11px] text-ink-500">{p.userEmail ?? "—"}</p>
                  </div>
                </div>
              </Td>
              <Td className="text-ink-700">
                <p>{p.tournamentName ?? "—"}</p>
                {p.categoryLabel && <p className="text-[11px] text-ink-500">{p.categoryLabel}</p>}
              </Td>
              <Td>
                <code className="text-[11px] text-ink-500">{p.paymentId ?? "—"}</code>
              </Td>
              <Td className="text-ink-700">{p.paymentMethod ?? "—"}</Td>
              <Td>
                <PaymentStatusPill status={p.paymentStatus} />
              </Td>
              <Td className="text-ink-500">{formatDate(p.paidAt)}</Td>
              <Td className="text-right">
                {p.paymentStatus !== "REFUNDED" && p.paymentId && (
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <button
                          title="Reembolsar"
                          className="size-8 rounded-lg hover:bg-warning-bg inline-flex items-center justify-center"
                        >
                          <RotateCcw size={15} color="#A05E00" />
                        </button>
                      }
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reembolsar pagamento?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Será marcado como reembolsado. A integração efetiva com o Stripe deve ser concluída no backend.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => refundMut.mutate(p.id)}>
                          Confirmar reembolso
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

function PaymentStatusPill({ status }: { status: string | null }) {
  switch (status) {
    case "PAID":
    case "succeeded":
      return <Pill tone="success">Pago</Pill>;
    case "PENDING":
    case "pending":
    case "processing":
      return <Pill tone="warning">Pendente</Pill>;
    case "REFUNDED":
    case "refunded":
      return <Pill tone="info">Reembolsado</Pill>;
    case "FAILED":
    case "failed":
      return <Pill tone="danger">Falhou</Pill>;
    default:
      return <Pill>{status ?? "—"}</Pill>;
  }
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
}
