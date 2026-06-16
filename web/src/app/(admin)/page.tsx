import { PageShell } from "@/components/admin/page-shell";
import { DashboardContent } from "@/components/admin/dashboard-content";
import { getDashboard } from "@/lib/api/admin";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboard().catch(() => null);
  return (
    <PageShell title="Dashboard" subtitle="Visão geral da plataforma">
      <DashboardContent data={data} />
    </PageShell>
  );
}
