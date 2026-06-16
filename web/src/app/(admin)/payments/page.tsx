import { PageShell } from "@/components/admin/page-shell";
import { PaymentsContent } from "@/components/admin/payments-content";

export const metadata = { title: "Pagamentos · ToquePlay Admin" };

export default function PaymentsPage() {
  return (
    <PageShell title="Pagamentos" subtitle="Transações processadas pelo Stripe">
      <PaymentsContent />
    </PageShell>
  );
}
