"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, ExternalLink as ExternalLinkIcon, Loader2, MessageSquare, Power } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { Card, CardHeader, EmptyState, GhostButton, PrimaryButton } from "./ui";

interface SystemStatus {
  maintenanceMode: boolean;
  globalMessage: string | null;
  version: string;
}

interface Monitoring {
  activeMatches: number;
  onlineUsers: number;
  webSocketConnections: number;
}

export function SettingsContent() {
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const [maintenance, setMaintenance] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "system"],
    queryFn: () => api.get<SystemStatus>("admin/system"),
  });

  const monitoring = useQuery({
    queryKey: ["admin", "monitoring"],
    queryFn: () => api.get<Monitoring>("admin/monitoring"),
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (data) {
      setMaintenance(data.maintenanceMode);
      setMessage(data.globalMessage ?? "");
    }
  }, [data]);

  const saveMut = useMutation({
    mutationFn: (payload: { maintenanceMode?: boolean; globalMessage?: string }) =>
      api.patch<SystemStatus>("admin/system", payload),
    onSuccess: (updated) => {
      toast.success("Configurações salvas");
      setMaintenance(updated.maintenanceMode);
      setMessage(updated.globalMessage ?? "");
      qc.invalidateQueries({ queryKey: ["admin", "system"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "http://localhost:3000";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader title="Modo de manutenção" />
          <div className="p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setMaintenance((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${maintenance ? "bg-brand-500" : "bg-brand-100"}`}
                aria-pressed={maintenance}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${maintenance ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
              <div>
                <p className="font-bold text-ink-900 inline-flex items-center gap-2">
                  <Power size={14} color={maintenance ? "#A05E00" : "#1FB87A"} />
                  {maintenance ? "Plataforma em manutenção" : "Plataforma ativa"}
                </p>
                <p className="text-xs text-ink-500">
                  Quando ativo, usuários comuns recebem erro 503 nas rotas não-admin.
                </p>
              </div>
            </label>
          </div>
        </Card>

        <Card>
          <CardHeader title="Mensagem global" />
          <div className="p-5">
            <div className="flex items-start gap-2">
              <MessageSquare size={16} className="text-ink-500 mt-2.5" />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Mensagem exibida no topo do app (deixe vazio para remover)"
                className="flex-1 rounded-xl bg-page border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900 p-3 resize-none"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <GhostButton onClick={() => setMessage("")}>Limpar</GhostButton>
              <PrimaryButton
                onClick={() => saveMut.mutate({ maintenanceMode: maintenance, globalMessage: message })}
                disabled={saveMut.isPending || isLoading}
                icon={saveMut.isPending ? <Loader2 size={14} className="animate-spin" /> : undefined}
              >
                Salvar
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <p className="font-display text-sm text-ink-900 inline-flex items-center gap-2">
            <Activity size={16} color="#6D2EC0" /> MONITORAMENTO
          </p>
          {monitoring.isLoading ? (
            <p className="text-xs text-ink-500 mt-3">Carregando…</p>
          ) : monitoring.data ? (
            <div className="mt-3 space-y-3">
              <KV k="Partidas ao vivo" v={String(monitoring.data.activeMatches)} />
              <KV k="Usuários online" v={String(monitoring.data.onlineUsers)} />
              <KV k="Conexões WS" v={String(monitoring.data.webSocketConnections)} />
            </div>
          ) : (
            <EmptyState title="Indisponível" />
          )}
        </Card>

        <Card className="p-5">
          <p className="font-display text-sm text-ink-900">VERSÃO</p>
          <p className="text-xs text-ink-500 mt-1">{data?.version ?? "—"}</p>
          <div className="mt-4 space-y-2">
            <ExternalLink href={`${apiBase}/api/docs`}>Swagger / Documentação API</ExternalLink>
            <ExternalLink href={`${apiBase}/api/admin/queues`}>BullBoard (filas)</ExternalLink>
          </div>
        </Card>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-500">{k}</span>
      <span className="text-sm font-bold text-ink-900">{v}</span>
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:underline"
    >
      {children} <ExternalLinkIcon size={12} />
    </a>
  );
}
