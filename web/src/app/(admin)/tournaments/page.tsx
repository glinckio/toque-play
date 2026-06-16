import { PageShell } from "@/components/admin/page-shell";
import { TournamentsContent } from "@/components/admin/tournaments-content";

export const metadata = { title: "Torneios · ToquePlay Admin" };

export default function TournamentsPage() {
  return (
    <PageShell title="Torneios" subtitle="Modere e acompanhe torneios da plataforma">
      <TournamentsContent />
    </PageShell>
  );
}
