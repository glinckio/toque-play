import { notFound } from "next/navigation";
import { PageShell } from "@/components/admin/page-shell";
import { UserEditForm } from "./edit-form";
import { getUser } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/types";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let user;
  try {
    user = await getUser(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <PageShell title={user.name} subtitle="Edição administrador (bypass de regras)">
      <UserEditForm initial={user} />
    </PageShell>
  );
}
