import { notFound } from "next/navigation";
import { PageShell } from "@/components/admin/page-shell";
import { FriendlyForm } from "@/components/admin/friendly-form";
import { serverGet } from "@/lib/api";
import { ApiError } from "@/lib/api/types";

export const dynamic = "force-dynamic";

interface FriendlyDetail {
  id: string;
  title?: string | null;
  status: string;
  date: string;
  startTime?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  modality?: string | null;
  categoryFormat?: string | null;
  scoreTeamA?: number | null;
  scoreTeamB?: number | null;
  requesterId: string;
  requesterTeamId?: string | null;
  challengedId?: string | null;
  challengedTeamId?: string | null;
  requester?: { id: string; name: string; email: string } | null;
  requesterTeam?: { id: string; name: string } | null;
  challenged?: { id: string; name: string; email: string } | null;
  challengedTeam?: { id: string; name: string } | null;
}

export default async function FriendlyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let friendly: FriendlyDetail;
  try {
    friendly = await serverGet<FriendlyDetail>(`admin/friendlies/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <PageShell title={friendly.title ?? "Amistoso"} subtitle="Edição administrador (bypass)">
      <FriendlyForm mode="edit" initial={friendly} />
    </PageShell>
  );
}
