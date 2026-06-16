"use client";

import { useState } from "react";
import { TournamentEditForm } from "@/app/(admin)/tournaments/[id]/edit-form";
import { ChangeOwnerTab } from "./change-owner-tab";
import { TournamentMediaTab } from "./tournament-media-tab";
import { RegistrationsManager } from "./registrations-manager";
import type { AdminTournamentDetail } from "@/lib/api/admin";

type Tab = "dados" | "owner" | "midia" | "inscricoes";

const TABS: { key: Tab; label: string }[] = [
  { key: "dados", label: "Dados" },
  { key: "owner", label: "Organizador" },
  { key: "midia", label: "Mídia" },
  { key: "inscricoes", label: "Inscrições" },
];

export function TournamentDetailTabs({ initial }: { initial: AdminTournamentDetail }) {
  const [tab, setTab] = useState<Tab>("dados");

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-white border border-brand-100 rounded-xl p-1 sticky top-0 z-10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 h-9 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-brand-500 text-white" : "text-ink-700 hover:bg-brand-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dados" && <TournamentEditForm initial={initial} />}
      {tab === "owner" && <ChangeOwnerTab tournament={initial} />}
      {tab === "midia" && (
        <TournamentMediaTab tournamentId={initial.id} currentImage={initial.imageUrl ?? null} />
      )}
      {tab === "inscricoes" && <RegistrationsManager tournamentId={initial.id} />}
    </div>
  );
}
