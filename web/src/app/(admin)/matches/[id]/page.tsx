import { notFound } from "next/navigation";
import { PageShell } from "@/components/admin/page-shell";
import { MatchDetailContent } from "@/components/admin/match-detail-content";
import { serverGet } from "@/lib/api";
import { ApiError } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export interface MatchDetail {
  id: string;
  status: string;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  scoreTeamA: number;
  scoreTeamB: number;
  round: number;
  label: string | null;
  bestOfSets: number | null;
  teamA?: { id: string; name: string } | null;
  teamB?: { id: string; name: string } | null;
  winner?: { id: string; name: string } | null;
  bracket?: {
    id: string;
    tournamentId: string;
    tournament?: { id: string; name: string } | null;
  } | null;
  sets: Array<{ id: string; setNumber: number; scoreA: number; scoreB: number }>;
  matchEvents: Array<{
    id: string;
    type: string;
    setNumber: number | null;
    team: string | null;
    scoreA: number | null;
    scoreB: number | null;
    teamId: string | null;
    playerOutId: string | null;
    playerInId: string | null;
    createdBy: string;
    createdAt: string;
  }>;
  pointEvents: Array<{
    id: string;
    setNumber: number;
    scoredBy: string;
    timestamp: string;
  }>;
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let match: MatchDetail;
  try {
    match = await serverGet<MatchDetail>(`admin/matches/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <PageShell
      title={match.teamA?.name && match.teamB?.name ? `${match.teamA.name} vs ${match.teamB.name}` : "Partida"}
      subtitle={match.bracket?.tournament?.name ?? ""}
    >
      <MatchDetailContent initial={match} />
    </PageShell>
  );
}
