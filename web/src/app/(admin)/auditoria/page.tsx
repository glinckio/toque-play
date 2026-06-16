import { PageShell } from "@/components/admin/page-shell";
import { AuditContent } from "@/components/admin/audit-content";

export const metadata = { title: "Auditoria · ToquePlay Admin" };

export default function AuditoriaPage() {
  return (
    <PageShell
      title="Auditoria"
      subtitle="Trilha completa de eventos do sistema"
    >
      <AuditContent />
    </PageShell>
  );
}
