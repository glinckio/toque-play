import { PageShell } from "@/components/admin/page-shell";
import { TwoFactorSetupContent } from "@/components/admin/two-factor-setup-content";

export const metadata = { title: "Autenticação 2FA · ToquePlay Admin" };

export default function TwoFactorPage() {
  return (
    <PageShell
      title="Autenticação 2FA"
      subtitle="Proteja sua conta com TOTP e códigos de backup"
    >
      <TwoFactorSetupContent />
    </PageShell>
  );
}
