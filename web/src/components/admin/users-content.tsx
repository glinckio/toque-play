"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Check, Download, Loader2, Lock, MoreHorizontal, Search, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { api, type Paginated } from "@/lib/api/client";
import { initials } from "@/lib/utils";
import { EmptyState, FilterChip, GhostButton, Pill, PrimaryButton, Td, Th, TableShell, Toolbar } from "./ui";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
  createdAt: string;
}

type RoleFilter = "all" | "ATLETA" | "ORGANIZADOR" | "SUPER_ADMIN";

export function UsersContent() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [page, setPage] = useState(1);
  const limit = 20;
  const qc = useQueryClient();
  const [exportModal, setExportModal] = useState<null | "masked" | "full">(null);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "users", { search, role, page }],
    queryFn: () =>
      api.get<Paginated<AdminUser>>("admin/users", {
        search: search || undefined,
        page,
        limit,
      }),
  });

  const blockMut = useMutation({
    mutationFn: (id: string) => api.patch(`admin/users/${id}/block`),
    onSuccess: () => {
      toast.success("Usuário bloqueado");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const unblockMut = useMutation({
    mutationFn: (id: string) => api.patch(`admin/users/${id}/unblock`),
    onSuccess: () => {
      toast.success("Usuário reativado");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const users = data?.data ?? [];

  const filtered = role === "all" ? users : users.filter((u) => u.role === role);

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
            placeholder="Buscar por nome ou email"
            className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900"
          />
        </div>
        <FilterChip active={role === "all"} onClick={() => { setRole("all"); setPage(1); }}>Todos</FilterChip>
        <FilterChip active={role === "ATLETA"} onClick={() => { setRole("ATLETA"); setPage(1); }}>Atletas</FilterChip>
        <FilterChip active={role === "ORGANIZADOR"} onClick={() => { setRole("ORGANIZADOR"); setPage(1); }}>Organizadores</FilterChip>
        <FilterChip active={role === "SUPER_ADMIN"} onClick={() => { setRole("SUPER_ADMIN"); setPage(1); }}>Admins</FilterChip>
        <div className="flex-1" />
        <GhostButton
          icon={<Download size={14} />}
          onClick={() => setExportModal("masked")}
        >
          Exportar
        </GhostButton>
        <PrimaryButton icon={<span>+</span>}>Novo usuário</PrimaryButton>
      </Toolbar>

      {exportModal && (
        <ExportModal
          mode={exportModal}
          code={twoFaCode}
          onCodeChange={setTwoFaCode}
          unlocking={unlocking}
          downloading={downloading}
          onClose={() => {
            setExportModal(null);
            setTwoFaCode("");
          }}
          onDownloadMasked={async () => {
            setDownloading(true);
            try {
              await downloadCsv("/api/proxy/admin/users/export");
              setExportModal(null);
            } catch {
              toast.error("Falha no download");
            } finally {
              setDownloading(false);
            }
          }}
          onDownloadFull={async () => {
            if (twoFaCode.trim().length < 6) {
              toast.error("Informe o código 2FA");
              return;
            }
            setUnlocking(true);
            try {
              const res = await fetch("/api/proxy/admin/users/export-unlock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: twoFaCode.trim() }),
              });
              const body = await res.json().catch(() => ({}));
              if (!res.ok) {
                toast.error(body?.message ?? "Código 2FA inválido");
                return;
              }
              setUnlocking(false);
              setDownloading(true);
              await downloadCsv(
                `/api/proxy/admin/users/export?fullPii=true&unlockToken=${encodeURIComponent(body.unlockToken)}`,
              );
              setExportModal(null);
              setTwoFaCode("");
            } catch {
              toast.error("Falha no download");
            } finally {
              setUnlocking(false);
              setDownloading(false);
            }
          }}
        />
      )}

      <TableShell>
        <thead>
          <tr>
            <Th>Usuário</Th>
            <Th>Perfil</Th>
            <Th>Status</Th>
            <Th>Cadastro</Th>
            <Th className="text-right">Ações</Th>
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
              <Td className="text-danger-fg">Falha ao carregar usuários.</Td>
              <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {!isLoading && filtered.length === 0 && (
            <tr>
              <Td>
                <EmptyState title="Nenhum usuário encontrado" />
              </Td>
              <Td /> <Td /> <Td /> <Td />
            </tr>
          )}
          {filtered.map((u) => (
            <tr key={u.id} className="hover:bg-brand-50/40">
              <Td>
                <Link href={`/users/${u.id}`} className="flex items-center gap-3 hover:opacity-80">
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatarUrl} alt={u.name} className="size-9 rounded-full object-cover" />
                  ) : (
                    <span className="size-9 rounded-full bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-700">
                      {initials(u.name)}
                    </span>
                  )}
                  <div>
                    <p className="font-bold text-ink-900 underline-offset-2 hover:underline">{u.name}</p>
                    <p className="text-[11px] text-ink-500">{u.email}</p>
                  </div>
                </Link>
              </Td>
              <Td>
                <Pill tone={u.role === "SUPER_ADMIN" ? "warning" : u.role === "ORGANIZADOR" ? "info" : "neutral"}>
                  {u.role === "ATLETA" ? "Atleta" : u.role === "ORGANIZADOR" ? "Organizador" : u.role === "SUPER_ADMIN" ? "Admin" : u.role}
                </Pill>
              </Td>
              <Td>
                <StatusPill status={u.status} />
              </Td>
              <Td className="text-ink-500">{formatDate(u.createdAt)}</Td>
              <Td className="text-right">
                <div className="inline-flex items-center gap-1">
                  {u.status === "BLOCKED" ? (
                    <ActionButton
                      label="Reativar"
                      icon={<Check size={14} color="#1FB87A" />}
                      onClick={() => unblockMut.mutate(u.id)}
                      disabled={unblockMut.isPending}
                    />
                  ) : (
                    <ActionButton
                      label="Bloquear"
                      icon={<Ban size={14} color="#E04545" />}
                      onClick={() => blockMut.mutate(u.id)}
                      disabled={blockMut.isPending}
                    />
                  )}
                  <button className="size-8 rounded-lg hover:bg-brand-50 inline-flex items-center justify-center" aria-label="Mais ações">
                    <MoreHorizontal size={16} className="text-ink-500" />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      {data && data.totalPages > 1 && (
        <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "BLOCKED") return <Pill tone="danger">Bloqueado</Pill>;
  if (status === "PENDING") return <Pill tone="warning">Pendente</Pill>;
  return <Pill tone="success">Ativo</Pill>;
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="size-8 rounded-lg hover:bg-brand-50 inline-flex items-center justify-center disabled:opacity-50"
    >
      {icon}
    </button>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-ink-500">
      <span>
        Página {page} de {totalPages}
      </span>
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

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR");
}

async function downloadCsv(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Erro ${res.status}`);
  }
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = `users-${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}

function ExportModal({
  mode,
  code,
  onCodeChange,
  unlocking,
  downloading,
  onClose,
  onDownloadMasked,
  onDownloadFull,
}: {
  mode: "masked" | "full";
  code: string;
  onCodeChange: (v: string) => void;
  unlocking: boolean;
  downloading: boolean;
  onClose: () => void;
  onDownloadMasked: () => void | Promise<void>;
  onDownloadFull: () => void | Promise<void>;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(20,10,30,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-brand-100 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgb(244 239 250)" }}
          >
            {mode === "full" ? (
              <Lock size={18} className="text-brand-500" />
            ) : (
              <Download size={18} className="text-brand-500" />
            )}
          </div>
          <div>
            <h2 className="font-display text-base text-ink-900">
              Exportar usuários
            </h2>
            <p className="text-xs text-ink-500">
              {mode === "full"
                ? "CSV com PII completo — requer 2FA"
                : "CSV com PII mascarado"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onDownloadMasked()}
            disabled={downloading}
            className={`flex-1 h-10 rounded-xl font-bold text-xs ${
              mode === "masked"
                ? "text-white"
                : "text-ink-700 border border-brand-100 bg-page"
            } disabled:opacity-60`}
            style={
              mode === "masked"
                ? { background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }
                : undefined
            }
          >
            Mascarado
          </button>
          <button
            type="button"
            onClick={onDownloadFull}
            disabled={unlocking || downloading || code.trim().length < 6}
            className={`flex-1 h-10 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 ${
              mode === "full"
                ? "text-white"
                : "text-ink-700 border border-brand-100 bg-page"
            } disabled:opacity-60`}
            style={
              mode === "full"
                ? { background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }
                : undefined
            }
          >
            {(unlocking || downloading) && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Completo (2FA)
          </button>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
            Código 2FA (necessário apenas para PII completo)
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) =>
              onCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="000000"
            className="mt-1.5 w-full h-11 px-3 rounded-xl border border-brand-100 bg-page text-ink-900 tracking-widest text-center font-mono outline-none focus:border-brand-500"
          />
          <p className="text-[11px] text-ink-500 mt-1.5 flex items-center gap-1">
            <ShieldOff size={12} />
            Código de backup também aceito.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-xs text-ink-500 hover:text-ink-700 pt-1"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
