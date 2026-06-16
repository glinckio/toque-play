import { PageShell } from "@/components/admin/page-shell";
import { FriendliesContent } from "@/components/admin/friendlies-content";

export const metadata = { title: "Amistosos · ToquePlay Admin" };

export default function FriendliesPage() {
  return (
    <PageShell title="Amistosos" subtitle="Desafios entre times">
      <FriendliesContent />
    </PageShell>
  );
}
