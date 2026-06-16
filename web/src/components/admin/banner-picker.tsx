"use client";

import { useState } from "react";
import { Check, Loader2, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

export function BannerPicker({
  value,
  onChange,
  tournamentId,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  tournamentId?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const banners = useQuery({
    queryKey: ["admin", "tournaments", "banners"],
    queryFn: () => api.get<string[]>("admin/tournaments/banners"),
  });

  async function handleUpload(file: File) {
    if (!tournamentId) {
      toast.info("Salve o torneio primeiro, depois faça upload pela aba Mídia.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/proxy/admin/tournaments/${tournamentId}/cover`, {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `Erro ${res.status}`);
      }
      const data = (await res.json()) as { imageUrl: string };
      onChange(data.imageUrl);
      toast.success("Upload concluído");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  if (banners.isLoading) return <p className="text-xs text-ink-500">Carregando banners…</p>;
  if (banners.isError) return <p className="text-xs text-danger-fg">Falha ao carregar banners.</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(banners.data ?? []).map((url) => {
          const selected = value === url;
          return (
            <button
              key={url}
              type="button"
              onClick={() => onChange(selected ? null : url)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                selected
                  ? "border-brand-500 ring-2 ring-brand-500/30"
                  : "border-brand-100 hover:border-brand-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="banner" className="w-full h-20 object-cover" />
              {selected && (
                <span className="absolute top-1.5 right-1.5 size-6 rounded-full bg-brand-500 text-white inline-flex items-center justify-center">
                  <Check size={13} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-2">
          Upload do computador
        </p>
        <label className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-dashed border-brand-200 bg-brand-50/50 hover:bg-brand-50 cursor-pointer text-sm text-ink-700 font-semibold">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Enviar imagem
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
        </label>
        {!tournamentId && (
          <p className="text-[11px] text-ink-500 mt-1">
            Disponível após criar o torneio.
          </p>
        )}
      </div>
    </div>
  );
}
