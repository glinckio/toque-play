import { ReactNode } from "react";
import { Topbar } from "./sidebar";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <main className="flex-1 px-8 py-7 overflow-y-auto">{children}</main>
    </>
  );
}
