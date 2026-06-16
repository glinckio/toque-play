import { PageShell } from "@/components/admin/page-shell";
import { TournamentWizard } from "@/components/admin/tournament-wizard";

export const metadata = { title: "Novo torneio · ToquePlay Admin" };

export default function NewTournamentPage() {
  return (
    <PageShell title="Novo torneio" subtitle="Criação em etapas (admin bypass)">
      <TournamentWizard />
    </PageShell>
  );
}
