import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { getSessionUser } from "@/lib/auth/cookies";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen w-full flex bg-page">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
