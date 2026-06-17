"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Inbox } from "lucide-react";
import { toast } from "sonner";

type DpoRequest = {
  id: string;
  userId: string | null;
  email: string;
  type: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  REJECTED: "Rejeitado",
};

const TYPE_LABEL: Record<string, string> = {
  ACCESS: "Acesso",
  PORTABILITY: "Portabilidade",
  RECTIFICATION: "Retificação",
  DELETION: "Eliminação",
  COMPLAINT: "Reclamação",
  OTHER: "Outro",
};

export function DpoRequestsContent() {
  const [items, setItems] = useState<DpoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/admin/privacy/dpo-requests", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : data.items ?? []);
      }
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(
        `/api/proxy/admin/privacy/dpo-requests/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!res.ok) {
        toast.error("Falha ao atualizar status");
        return;
      }
      toast.success("Status atualizado");
      await load();
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink-500 gap-2">
        <Inbox size={32} className="text-ink-300" />
        <p className="text-sm">Nenhuma solicitação pendente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-2xl border border-brand-100 p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                  {TYPE_LABEL[req.type] ?? req.type}
                </span>
                <span className="text-xs text-ink-500">
                  {new Date(req.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-base text-ink-900">
                {req.subject}
              </h3>
              <p className="text-xs text-ink-500 mt-0.5">{req.email}</p>
            </div>
            <select
              value={req.status}
              onChange={(e) => updateStatus(req.id, e.target.value)}
              disabled={updating === req.id}
              className="h-9 px-3 rounded-lg border border-brand-100 bg-page text-xs font-semibold text-ink-900 outline-none focus:border-brand-500 disabled:opacity-60"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s] ?? s}
                </option>
              ))}
            </select>
          </div>
          {req.message && (
            <p className="text-sm text-ink-700 whitespace-pre-line border-t border-brand-50 pt-3">
              {req.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
