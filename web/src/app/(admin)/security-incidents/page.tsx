import { PageShell } from "@/components/admin/page-shell";
import { SecurityIncidentsContent } from "@/components/admin/security-incidents-content";

export const metadata = { title: "Incidentes de Segurança · ToquePlay Admin" };

export default function SecurityIncidentsPage() {
  return (
    <PageShell
      title="Incidentes de Segurança"
      subtitle="Registro e acompanhamento (LGPD art. 48 — ANPD 2 dias úteis)"
    >
      <SecurityIncidentsContent />
    </PageShell>
  );
}
