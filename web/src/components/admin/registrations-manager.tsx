"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Crown, Loader2, Plus, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { api, type Paginated } from "@/lib/api/client";
import { initials } from "@/lib/utils";
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
import { Card, CardHeader, EmptyState, GhostButton, Pill, PrimaryButton } from "./ui";
import { Combobox } from "./combobox";

interface Member {
  id: string;
  isCaptain: boolean;
  teamMember: {
    id: string;
    user?: { id: string; name: string; avatarUrl?: string | null } | null;
    guestName?: string | null;
  };
}

interface Registration {
  id: string;
  status: string;
  paymentStatus: string | null;
  createdAt: string;
  team: { id: string; name: string };
  user: { id: string; name: string; email: string };
  members: Member[];
}

interface TeamOpt { id: string; name: string; ownerId: string; }
interface TeamMemberOpt {
  id: string;
  user?: { id: string; name: string } | null;
  guestName?: string | null;
  isCaptain: boolean;
}

export function RegistrationsManager({ tournamentId }: { tournamentId: string }) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);

  const regs = useQuery({
    queryKey: ["admin", "tournaments", tournamentId, "registrations"],
    queryFn: () => api.get<Registration[]>(`admin/tournaments/${tournamentId}/registrations`),
  });

  const deleteRegMut = useMutation({
    mutationFn: (regId: string) => api.delete(`admin/registrations/${regId}`),
    onSuccess: () => {
      toast.success("Inscrição removida");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments", tournamentId, "registrations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleCaptainMut = useMutation({
    mutationFn: ({ regId, memberId, make }: { regId: string; memberId: string; make: boolean }) =>
      api.patch(`admin/registrations/${regId}/members/${memberId}`, { isCaptain: make ? 1 : 0 }),
    onSuccess: () => {
      toast.success("Capitão atualizado");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments", tournamentId, "registrations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMemberMut = useMutation({
    mutationFn: ({ regId, memberId }: { regId: string; memberId: string }) =>
      api.delete(`admin/registrations/${regId}/members/${memberId}`),
    onSuccess: () => {
      toast.success("Membro removido");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments", tournamentId, "registrations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = regs.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-ink-500">
          {list.length} inscrição(ões) neste torneio
        </p>
        <PrimaryButton
          icon={<Plus size={14} />}
          onClick={() => setAdding(true)}
        >
          Inscrever time
        </PrimaryButton>
      </div>

      {regs.isLoading && <p className="text-sm text-ink-500">Carregando…</p>}
      {regs.isError && <p className="text-sm text-danger-fg">Falha ao carregar.</p>}
      {!regs.isLoading && list.length === 0 && (
        <Card>
          <EmptyState
            title="Nenhuma inscrição"
            hint="Use 'Inscrever time' para adicionar manualmente."
          />
        </Card>
      )}

      {list.map((reg) => (
        <Card key={reg.id}>
          <CardHeader
            title={reg.team.name}
            action={
              <div className="flex items-center gap-2">
                <Pill tone={reg.status === "CONFIRMED" ? "success" : reg.status === "CANCELLED" ? "danger" : "warning"}>
                  {reg.status}
                </Pill>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <button
                        title="Remover inscrição"
                        className="size-8 rounded-lg hover:bg-danger-bg inline-flex items-center justify-center"
                      >
                        <Trash2 size={15} color="#E04545" />
                      </button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover inscrição de "{reg.team.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        A inscrição e todos os membros serão removidos do torneio.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteRegMut.mutate(reg.id)}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            }
          />
          <div className="p-5">
            <p className="text-[11px] text-ink-500 mb-2">
              Responsável: {reg.user.name} · {reg.user.email}
            </p>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-2">
              Membros
            </p>
            <div className="space-y-2">
              {reg.members.length === 0 && (
                <p className="text-xs text-ink-500">Nenhum membro.</p>
              )}
              {reg.members.map((m) => {
                const name = m.teamMember.user?.name ?? m.teamMember.guestName ?? "Membro";
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-page border border-brand-100"
                  >
                    <span className="size-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                      {initials(name)}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-900">{name}</p>
                      {m.isCaptain && <span className="text-[10px] text-warning-fg">Capitão</span>}
                    </div>
                    <button
                      onClick={() =>
                        toggleCaptainMut.mutate({
                          regId: reg.id,
                          memberId: m.id,
                          make: !m.isCaptain,
                        })
                      }
                      title={m.isCaptain ? "Remover capitão" : "Tornar capitão"}
                      className={`size-8 rounded-lg inline-flex items-center justify-center ${
                        m.isCaptain ? "bg-warning-bg" : "hover:bg-brand-50"
                      }`}
                    >
                      <Crown size={14} color={m.isCaptain ? "#A05E00" : "#A89BBA"} />
                    </button>
                    <button
                      onClick={() => removeMemberMut.mutate({ regId: reg.id, memberId: m.id })}
                      title="Remover membro"
                      className="size-8 rounded-lg hover:bg-danger-bg inline-flex items-center justify-center"
                    >
                      <X size={14} color="#E04545" />
                    </button>
                  </div>
                );
              })}
            </div>

            <AddMemberButton regId={reg.id} tournamentId={tournamentId} />
          </div>
        </Card>
      ))}

      {adding && (
        <AddRegistrationModal
          tournamentId={tournamentId}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function AddMemberButton({ regId, tournamentId }: { regId: string; tournamentId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [teamMemberId, setTeamMemberId] = useState("");

  // Busca membros do time da inscrição atual
  const { data: reg } = useQuery({
    queryKey: ["admin", "registrations", regId],
    queryFn: () => api.get<Registration>(`admin/registrations/${regId}`),
    enabled: open,
  });
  const teamId = reg?.team.id;

  const { data: teamMembers } = useQuery({
    queryKey: ["admin", "teams", teamId, "members"],
    queryFn: () =>
      api.get<{ id: string; name: string }[]>(
        `admin/teams/${teamId}/members`,
      ),
    enabled: !!teamId && open,
  });

  // Fallback: usar /admin/teams e listar membros via Prisma — endpoint pode não existir.
  // Em vez disso, chame diretamente o endpoint público /teams/:teamId/members se houver.

  const addMut = useMutation({
    mutationFn: () =>
      api.post(`admin/registrations/${regId}/members`, { teamMemberId, isCaptain: 0 }),
    onSuccess: () => {
      toast.success("Membro adicionado");
      setOpen(false);
      setTeamMemberId("");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments", tournamentId, "registrations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mt-3">
      {!open ? (
        <GhostButton icon={<UserPlus size={13} />} onClick={() => setOpen(true)}>
          Adicionar membro
        </GhostButton>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-page border border-brand-100">
          <input
            placeholder="ID do TeamMember"
            value={teamMemberId}
            onChange={(e) => setTeamMemberId(e.target.value)}
            className="flex-1 h-9 px-3 rounded-lg bg-white border border-brand-100 outline-none text-xs"
          />
          <PrimaryButton onClick={() => addMut.mutate()} disabled={!teamMemberId || addMut.isPending}>
            {addMut.isPending ? <Loader2 size={13} className="animate-spin" /> : "OK"}
          </PrimaryButton>
          <GhostButton onClick={() => setOpen(false)}>Cancelar</GhostButton>
        </div>
      )}
    </div>
  );
}

function AddRegistrationModal({
  tournamentId,
  onClose,
}: {
  tournamentId: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [teamId, setTeamId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const teams = useQuery({
    queryKey: ["admin", "teams", "for-reg"],
    queryFn: () => api.get<Paginated<TeamOpt>>("admin/teams", { limit: 100 }),
  });

  // Buscar membros do time selecionado
  const teamMembers = useQuery({
    queryKey: ["admin", "teams", teamId, "members-list"],
    queryFn: () =>
      api.get<TeamMemberOpt[]>(`teams/${teamId}/members`),
    enabled: !!teamId,
  });

  const createMut = useMutation({
    mutationFn: () => {
      const team = (teams.data?.data ?? []).find((t) => t.id === teamId);
      if (!team) throw new Error("Selecione um time");
      return api.post(`admin/tournaments/${tournamentId}/registrations`, {
        teamId,
        userId: team.ownerId,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "ADMIN",
        members: selectedMembers.map((id) => ({ teamMemberId: id, isCaptain: 0 })),
      });
    },
    onSuccess: () => {
      toast.success("Inscrição criada");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments", tournamentId, "registrations"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const teamList = teams.data?.data ?? [];
  const memberList = teamMembers.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-base text-ink-900">INSCREVER TIME</p>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-brand-50 inline-flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <label className="block">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
            Time
          </span>
          <Combobox
            value={teamId}
            onChange={(v) => {
              setTeamId(v);
              setSelectedMembers([]);
            }}
            placeholder="Buscar time…"
            searchPlaceholder="Digite o nome…"
            options={teamList.map((t) => ({ value: t.id, label: t.name }))}
          />
        </label>

        {teamId && (
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-2">
              Membros ({selectedMembers.length} selecionados)
            </p>
            {teamMembers.isLoading ? (
              <p className="text-xs text-ink-500">Carregando…</p>
            ) : teamMembers.isError ? (
              <p className="text-xs text-danger-fg">
                Falha ao carregar membros. Verifique se GET /teams/:id/members existe.
              </p>
            ) : memberList.length === 0 ? (
              <p className="text-xs text-ink-500">Time sem membros.</p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {memberList.map((m) => {
                  const name = m.user?.name ?? m.guestName ?? "—";
                  const checked = selectedMembers.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer ${
                        checked ? "bg-brand-50 border-brand-500" : "bg-page border-brand-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedMembers([...selectedMembers, m.id]);
                          else setSelectedMembers(selectedMembers.filter((id) => id !== m.id));
                        }}
                      />
                      <span className="text-sm text-ink-900">
                        {name}
                        {m.isCaptain && <span className="text-[10px] text-warning-fg ml-2">capitão time</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-hairline">
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton
            onClick={() => createMut.mutate()}
            disabled={!teamId || selectedMembers.length === 0 || createMut.isPending}
            icon={createMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          >
            Criar inscrição
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
