"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Check, Download, MoreHorizontal, Search } from "lucide-react";
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
        <GhostButton icon={<Download size={14} />}>Exportar</GhostButton>
        <PrimaryButton icon={<span>+</span>}>Novo usuário</PrimaryButton>
      </Toolbar>

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
