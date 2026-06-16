"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { api, type Paginated } from "@/lib/api/client";
import {
  AUDIT_ENTITY_LABELS,
  actionTone,
  formatDateTime,
  type AuditLog,
  type PaginatedAuditLogs,
} from "@/lib/types/audit";
import {
  EmptyState,
  FilterChip,
  GhostButton,
  Pill,
  Td,
  Th,
  TableShell,
  Toolbar,
} from "./ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ENTITY_OPTIONS = [
  "Tournament",
  "Registration",
  "Friendly",
  "User",
  "Team",
  "Match",
] as const;

type EntityType = (typeof ENTITY_OPTIONS)[number] | "all";

function formatJson(value: unknown): string {
  if (value == null) return "—";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function valueDisplay(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function actionLabel(action: string): string {
  return action
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AuditContent() {
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState<EntityType>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const limit = 25;

  const query = useMemo(
    () => ({
      search: search || undefined,
      entityType: entityType === "all" ? undefined : entityType,
      page,
      limit,
    }),
    [search, entityType, page],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "audit-logs", query],
    queryFn: () =>
      api.get<PaginatedAuditLogs>("admin/audit-logs", query),
  });

  const logs = data?.data ?? [];

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
            placeholder="Buscar por ação, email ou entidade"
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
        <FilterChip active={entityType === "all"} onClick={() => { setEntityType("all"); setPage(1); }}>
          Todas
        </FilterChip>
        {ENTITY_OPTIONS.map((e) => (
          <FilterChip
            key={e}
            active={entityType === e}
            onClick={() => { setEntityType(e); setPage(1); }}
          >
            {AUDIT_ENTITY_LABELS[e] ?? e}
          </FilterChip>
        ))}
      </Toolbar>

      <TableShell>
        <thead>
          <tr>
            <Th>Data / hora</Th>
            <Th>Ação</Th>
            <Th>Entidade</Th>
            <Th>Ator</Th>
            <Th>IP</Th>
            <Th>Método</Th>
            <Th className="text-right">Detalhes</Th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <Td className="text-ink-500">Carregando…</Td>
              <Td /><Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
          {isError && (
            <tr>
              <Td className="text-danger-fg">Falha ao carregar auditoria.</Td>
              <Td /><Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
          {!isLoading && logs.length === 0 && (
            <tr>
              <Td><EmptyState title="Nenhum evento encontrado" /></Td>
              <Td /><Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-brand-50/40">
              <Td>
                <p className="font-semibold text-ink-900">{formatDateTime(log.createdAt)}</p>
              </Td>
              <Td>
                <Pill tone={actionTone(log.action)}>{actionLabel(log.action)}</Pill>
              </Td>
              <Td>
                <p className="font-medium text-ink-900">{AUDIT_ENTITY_LABELS[log.entityType] ?? log.entityType}</p>
                {log.entityId && (
                  <p className="text-[11px] text-ink-500 font-mono">{log.entityId.slice(0, 8)}…</p>
                )}
              </Td>
              <Td>
                {log.actor ? (
                  <div>
                    <p className="font-medium text-ink-900">{log.actor.name}</p>
                    <p className="text-[11px] text-ink-500">{log.actor.email}</p>
                  </div>
                ) : log.actorEmail ? (
                  <p className="text-ink-500">{log.actorEmail}</p>
                ) : (
                  <p className="text-ink-400 italic">Sistema</p>
                )}
                {log.actorRole && (
                  <p className="text-[10px] uppercase tracking-wide text-ink-400">{log.actorRole}</p>
                )}
              </Td>
              <Td className="text-ink-500 font-mono text-[11px]">{log.ipAddress ?? "—"}</Td>
              <Td>
                {log.method && (
                  <Pill tone="neutral">{log.method}</Pill>
                )}
              </Td>
              <Td className="text-right">
                <GhostButton
                  onClick={() => setSelected(log)}
                  icon={<ChevronDown size={14} />}
                >
                  Ver
                </GhostButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
      )}

      <Dialog open={selected != null} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selected ? actionLabel(selected.action) : ""}
            </DialogTitle>
            <DialogDescription>
              {selected
                ? `${AUDIT_ENTITY_LABELS[selected.entityType] ?? selected.entityType}${selected.entityId ? ` · ${selected.entityId}` : ""}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <DetailRow label="Data / hora" value={formatDateTime(selected.createdAt)} />
              <DetailRow label="Ator" value={selected.actor ? `${selected.actor.name} (${selected.actor.email})` : selected.actorEmail ?? "Sistema"} />
              <DetailRow label="Papel" value={selected.actorRole ?? "—"} />
              <DetailRow label="IP" value={selected.ipAddress ?? "—"} />
              <DetailRow label="User-Agent" value={selected.userAgent ?? "—"} />
              <DetailRow label="Rota" value={selected.route ?? "—"} />
              <DetailRow label="Método" value={selected.method ?? "—"} />

              <div>
                <p className="text-[11px] uppercase tracking-wide text-ink-500 font-bold mb-2">
                  Valores anteriores (oldValues)
                </p>
                <pre className="bg-brand-50 rounded-lg p-3 text-[11px] font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                  {formatJson(selected.oldValues)}
                </pre>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wide text-ink-500 font-bold mb-2">
                  Novos valores (newValues)
                </p>
                <pre className="bg-brand-50 rounded-lg p-3 text-[11px] font-mono whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                  {formatJson(selected.newValues)}
                </pre>
              </div>

              <Diff oldValues={selected.oldValues} newValues={selected.newValues} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-baseline">
      <p className="text-[11px] uppercase tracking-wide text-ink-500 font-bold">{label}</p>
      <p className="col-span-2 text-sm text-ink-900 break-all">{value}</p>
    </div>
  );
}

function Diff({ oldValues, newValues }: { oldValues: unknown; newValues: unknown }) {
  if (!oldValues || typeof oldValues !== "object") return null;
  if (!newValues || typeof newValues !== "object") return null;
  const oldObj = oldValues as Record<string, unknown>;
  const newObj = newValues as Record<string, unknown>;
  const keys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));
  const changes = keys
    .map((k) => ({
      key: k,
      from: valueDisplay(oldObj[k]),
      to: valueDisplay(newObj[k]),
      changed: valueDisplay(oldObj[k]) !== valueDisplay(newObj[k]),
    }))
    .filter((c) => c.changed);
  if (changes.length === 0) {
    return (
      <p className="text-[11px] text-ink-500 italic">Nenhuma diferença detectada entre os valores.</p>
    );
  }
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-500 font-bold mb-2">
        Mudanças detectadas
      </p>
      <ul className="space-y-1.5">
        {changes.map((c) => (
          <li key={c.key} className="text-[12px] grid grid-cols-[120px_1fr_1fr] gap-2 items-center">
            <span className="font-mono text-ink-700">{c.key}</span>
            <span className="line-through text-danger-fg truncate" title={c.from}>{c.from}</span>
            <span className="text-success-fg font-semibold truncate" title={c.to}>{c.to}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-ink-500">
      <span>Página {page} de {totalPages}</span>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 h-8 rounded-lg border border-brand-100 bg-white disabled:opacity-40"
      >
        Anterior
      </button>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 h-8 rounded-lg border border-brand-100 bg-white disabled:opacity-40"
      >
        Próxima
      </button>
    </div>
  );
}
