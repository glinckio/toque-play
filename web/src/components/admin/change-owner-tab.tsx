"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { api, type Paginated } from "@/lib/api/client";
import type { AdminTournamentDetail } from "@/lib/api/admin";
import { Card, CardHeader, PrimaryButton } from "./ui";
import { Combobox } from "./combobox";

interface UserOpt {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function ChangeOwnerTab({ tournament }: { tournament: AdminTournamentDetail }) {
  const qc = useQueryClient();
  const [ownerId, setOwnerId] = useState(tournament.ownerId);

  const users = useQuery({
    queryKey: ["admin", "users", "all-for-owner"],
    queryFn: () => api.get<Paginated<UserOpt>>("admin/users", { limit: 100 }),
  });

  const changeMut = useMutation({
    mutationFn: () => api.patch(`admin/tournaments/${tournament.id}/owner`, { ownerId }),
    onSuccess: () => {
      toast.success("Organizador atualizado");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const list = users.data?.data ?? [];

  return (
    <Card>
      <CardHeader title="Organizador responsável" />
      <div className="p-5 space-y-4">
        <p className="text-xs text-ink-500">
          Atual: <span className="font-bold text-ink-900">{tournament.owner?.name ?? "—"}</span>
          {tournament.owner?.email ? ` · ${tournament.owner.email}` : ""}
        </p>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-1.5">
            Novo organizador
          </span>
          <Combobox
            value={ownerId}
            onChange={setOwnerId}
            placeholder="Buscar organizador…"
            searchPlaceholder="Digite nome ou email…"
            options={list.map((u) => ({
              value: u.id,
              label: u.name,
              hint: `${u.email} · ${u.role}`,
            }))}
          />
        </label>
        <div className="flex justify-end">
          <PrimaryButton
            onClick={() => changeMut.mutate()}
            disabled={changeMut.isPending || ownerId === tournament.ownerId}
            icon={changeMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          >
            Salvar organizador
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}
