import { notFound } from "next/navigation";
import { PageShell } from "@/components/admin/page-shell";
import { TournamentDetailTabs } from "@/components/admin/tournament-detail-tabs";
import { getTournament } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let tournament;
  try {
    tournament = await getTournament(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <PageShell title={tournament.name} subtitle="Edição administrador (bypass de regras)">
      <TournamentDetailTabs initial={tournament} />
    </PageShell>
  );
}
