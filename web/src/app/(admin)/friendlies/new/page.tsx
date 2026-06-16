import { PageShell } from "@/components/admin/page-shell";
import { FriendlyForm } from "@/components/admin/friendly-form";

export const metadata = { title: "Novo amistoso · ToquePlay Admin" };

export default function NewFriendlyPage() {
  return (
    <PageShell title="Novo amistoso" subtitle="Criar desafio como administrador">
      <FriendlyForm mode="create" />
    </PageShell>
  );
}
