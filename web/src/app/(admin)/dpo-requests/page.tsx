import { PageShell } from "@/components/admin/page-shell";
import { DpoRequestsContent } from "@/components/admin/dpo-requests-content";

export const metadata = { title: "Solicitações DPO · ToquePlay Admin" };

export default function DpoRequestsPage() {
  return (
    <PageShell
      title="Solicitações DPO"
      subtitle="Pedidos de titulares de dados (LGPD art. 18)"
    >
      <DpoRequestsContent />
    </PageShell>
  );
}
