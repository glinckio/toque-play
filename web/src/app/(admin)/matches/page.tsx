import { PageShell } from "@/components/admin/page-shell";
import { MatchesContent } from "@/components/admin/matches-content";

export const metadata = { title: "Partidas · ToquePlay Admin" };

export default function MatchesPage() {
  return (
    <PageShell title="Partidas" subtitle="Histórico, ao vivo e arbitragens">
      <MatchesContent />
    </PageShell>
  );
}
