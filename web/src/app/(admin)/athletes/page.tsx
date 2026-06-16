import { PageShell } from "@/components/admin/page-shell";
import { AthletesContent } from "@/components/admin/athletes-content";

export const metadata = { title: "Atletas · ToquePlay Admin" };

export default function AthletesPage() {
  return (
    <PageShell title="Atletas" subtitle="Base de atletas registrados">
      <AthletesContent />
    </PageShell>
  );
}
