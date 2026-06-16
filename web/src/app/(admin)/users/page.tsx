import { PageShell } from "@/components/admin/page-shell";
import { UsersContent } from "@/components/admin/users-content";

export const metadata = { title: "Usuários · ToquePlay Admin" };

export default function UsersPage() {
  return (
    <PageShell title="Usuários" subtitle="Gerencie contas e permissões">
      <UsersContent />
    </PageShell>
  );
}
