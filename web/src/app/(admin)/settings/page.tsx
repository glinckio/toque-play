import { PageShell } from "@/components/admin/page-shell";
import { SettingsContent } from "@/components/admin/settings-content";

export const metadata = { title: "Configurações · ToquePlay Admin" };

export default function SettingsPage() {
  return (
    <PageShell title="Configurações" subtitle="Parâmetros do sistema">
      <SettingsContent />
    </PageShell>
  );
}
