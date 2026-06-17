"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, AlertTriangle, Plus } from "lucide-react";
import { toast } from "sonner";

type Incident = {
  id: string;
  type: string;
  severity: string;
  affectedUsers: number;
  detectedAt: string;
  status: string;
  notes: string | null;
};

const SEVERITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUS_OPTIONS = ["DETECTED", "CONTAINED", "RESOLVED", "REPORTED"];

const SEVERITY_LABEL: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  CRITICAL: "Crítica",
};

const STATUS_LABEL: Record<string, string> = {
  DETECTED: "Detectado",
  CONTAINED: "Contido",
  RESOLVED: "Resolvido",
  REPORTED: "Reportado",
};

const SEVERITY_COLOR: Record<string, string> = {
  LOW: "rgb(220 252 231)",
  MEDIUM: "rgb(254 243 199)",
  HIGH: "rgb(254 226 226)",
  CRITICAL: "rgb(224 69 69)",
};

export function SecurityIncidentsContent() {
  const [items, setItems] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    type: "",
    severity: "MEDIUM",
    affectedUsers: 0,
    notes: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "/api/proxy/admin/privacy/security-incident",
        { cache: "no-store" },
      );
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

  async function createIncident() {
    if (!form.type.trim()) {
      toast.error("Tipo do incidente é obrigatório");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/proxy/admin/privacy/security-incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type.trim(),
          severity: form.severity,
          affectedUsers: Number(form.affectedUsers) || 0,
          notes: form.notes.trim() || null,
        }),
      });
      if (!res.ok) {
        toast.error("Falha ao registrar incidente");
        return;
      }
      setForm({ type: "", severity: "MEDIUM", affectedUsers: 0, notes: "" });
      setCreating(false);
      toast.success("Incidente registrado");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-ink-500">
          {items.length} incidente(s) registrado(s)
        </p>
        <button
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-white font-bold text-xs"
          style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
        >
          <Plus size={14} />
          Novo incidente
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-2xl border border-brand-100 p-5 space-y-3">
          <h3 className="font-display text-base text-ink-900">
            Registrar incidente
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <input
                type="text"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value }))
                }
                placeholder="Ex: Vazamento de dados"
                className="w-full bg-transparent outline-none text-sm text-ink-900"
              />
            </Field>
            <Field label="Severidade">
              <select
                value={form.severity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, severity: e.target.value }))
                }
                className="w-full bg-transparent outline-none text-sm text-ink-900"
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {SEVERITY_LABEL[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Usuários afetados">
              <input
                type="number"
                min={0}
                value={form.affectedUsers}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    affectedUsers: Number(e.target.value),
                  }))
                }
                className="w-full bg-transparent outline-none text-sm text-ink-900"
              />
            </Field>
            <Field label="Notas">
              <input
                type="text"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Contexto adicional"
                className="w-full bg-transparent outline-none text-sm text-ink-900"
              />
            </Field>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCreating(false)}
              className="flex-1 h-10 rounded-xl border border-brand-100 text-ink-700 font-semibold text-sm hover:bg-page"
            >
              Cancelar
            </button>
            <button
              onClick={createIncident}
              disabled={submitting}
              className="flex-1 h-10 rounded-xl text-white font-bold text-sm disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#6D2EC0,#4A1F87)" }}
            >
              {submitting ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-ink-500 gap-2">
          <AlertTriangle size={32} className="text-ink-300" />
          <p className="text-sm">Nenhum incidente registrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((inc) => (
            <div
              key={inc.id}
              className="bg-white rounded-xl border border-brand-100 p-4 flex items-start gap-4"
            >
              <span
                className="mt-1 size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: SEVERITY_COLOR[inc.severity] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-sm text-ink-900">
                    {inc.type}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                    {SEVERITY_LABEL[inc.severity] ?? inc.severity}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-page text-ink-700">
                    {STATUS_LABEL[inc.status] ?? inc.status}
                  </span>
                </div>
                <p className="text-xs text-ink-500 mt-1">
                  {new Date(inc.detectedAt).toLocaleString("pt-BR")} ·{" "}
                  {inc.affectedUsers} usuário(s) afetado(s)
                </p>
                {inc.notes && (
                  <p className="text-xs text-ink-700 mt-2 whitespace-pre-line">
                    {inc.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider font-semibold text-ink-500">
        {label}
      </span>
      <div className="mt-1.5 flex items-center gap-2 h-10 px-3 rounded-xl border border-brand-100 bg-page focus-within:border-brand-500">
        {children}
      </div>
    </label>
  );
}
