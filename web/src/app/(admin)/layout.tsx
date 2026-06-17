import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { getSessionUser } from "@/lib/auth/cookies";
import { getConsentsState } from "@/lib/auth/consents";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // LGPD art. 8 — material change requires fresh acceptance. Block admin
  // access until the current TERMS_VERSION is accepted.
  const consents = await getConsentsState();
  if (consents?.termsOutdated) {
    redirect("/reconsent");
  }

  return (
    <div className="min-h-screen w-full flex bg-page">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
