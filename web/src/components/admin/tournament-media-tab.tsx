"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import { BannerPicker } from "./banner-picker";
import { Card, CardHeader } from "./ui";

export function TournamentMediaTab({
  tournamentId,
  currentImage,
}: {
  tournamentId: string;
  currentImage: string | null;
}) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(currentImage);

  const setUrlMut = useMutation({
    mutationFn: (url: string | null) =>
      api.patch(`admin/tournaments/${tournamentId}`, { imageUrl: url }),
    onSuccess: () => {
      toast.success("Banner atualizado");
      qc.invalidateQueries({ queryKey: ["admin", "tournaments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleChange(url: string | null) {
    setSelected(url);
    setUrlMut.mutate(url);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Banner do torneio" />
        <div className="p-5">
          {selected ? (
            <div className="relative rounded-2xl overflow-hidden border border-brand-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected} alt="banner" className="w-full h-48 object-cover" />
              <button
                onClick={() => handleChange(null)}
                className="absolute top-2 right-2 size-9 rounded-lg bg-black/60 text-white inline-flex items-center justify-center hover:bg-black/80"
                title="Remover banner"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-ink-500">Nenhum banner definido. Selecione abaixo ou faça upload.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Banners disponíveis no MinIO" />
        <div className="p-5">
          <BannerPicker
            value={selected}
            onChange={handleChange}
            tournamentId={tournamentId}
          />
        </div>
      </Card>
    </div>
  );
}
