"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Flag,
  Handshake,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  Swords,
  Trophy,
  Users,
  Volleyball,
} from "lucide-react";
import { initials } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth/constants";
import { NotificationsBell } from "./notifications-bell";

type NavKey = "dashboard" | "tournaments" | "matches" | "athletes" | "users" | "payments" | "friendlies" | "settings" | "auditoria";

interface NavItem {
  key: NavKey;
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  section?: string;
}

const items: NavItem[] = [
  { key: "dashboard", href: "/", label: "Dashboard", icon: LayoutDashboard, section: "Visão geral" },
  { key: "tournaments", href: "/tournaments", label: "Torneios", icon: Trophy, section: "Operação" },
  { key: "matches", href: "/matches", label: "Partidas", icon: Swords },
  { key: "friendlies", href: "/friendlies", label: "Amistosos", icon: Handshake },
  { key: "athletes", href: "/athletes", label: "Atletas", icon: Volleyball },
  { key: "users", href: "/users", label: "Usuários", icon: Users, section: "Gestão" },
  { key: "payments", href: "/payments", label: "Pagamentos", icon: CreditCard },
  { key: "settings", href: "/settings", label: "Configurações", icon: Settings, section: "Sistema" },
  { key: "auditoria", href: "/auditoria", label: "Auditoria", icon: ScrollText },
];

export function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      className="w-[248px] shrink-0 hidden md:flex flex-col text-white sticky top-0 h-screen"
      style={{ background: "linear-gradient(180deg,#1A0E2A 0%,#3D2C52 100%)" }}
    >
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5">
        <div
          className="size-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#6D2EC0,#A674F0)" }}
        >
          <Flag size={18} color="#FFF" strokeWidth={2.4} />
        </div>
        <div>
          <p className="font-display text-lg tracking-wider">TOQUEPLAY</p>
          <p className="text-[10px] uppercase tracking-wider text-white/50">Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const active = isActive(it.href);
          return (
            <div key={it.key}>
              {it.section && (
                <p className="px-3 pt-4 pb-2 text-[10px] uppercase tracking-wider font-bold text-white/35">
                  {it.section}
                </p>
              )}
              <Link
                href={it.href}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
                style={{ color: active ? "#FFF" : "rgba(255,255,255,0.7)" }}
              >
                {active && (
                  <span className="absolute left-0 w-1 h-5 rounded-r bg-brand-400" />
                )}
                <Icon size={18} strokeWidth={active ? 2.2 : 1.7} />
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{it.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <span className="size-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
              {initials(user.name)}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-white/55 truncate">{user.role}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

function LogoutButton() {
  return (
    <a
      href="/api/auth/logout"
      className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center"
      aria-label="Sair"
    >
      <LogOut size={15} color="rgba(255,255,255,0.7)" />
    </a>
  );
}

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="px-8 py-5 bg-white border-b border-brand-100 flex items-center gap-6 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <p className="font-display text-2xl text-ink-900 leading-none">{title.toUpperCase()}</p>
        <p className="text-xs text-ink-500 mt-1">{subtitle}</p>
      </div>
      <NotificationsBell />
    </header>
  );
}
