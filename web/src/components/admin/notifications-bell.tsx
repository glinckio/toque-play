"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Bell, Loader2 } from "lucide-react";
import { api } from "@/lib/api/client";

interface FeedItem {
  id: string;
  type: "USER" | "TOURNAMENT" | "FRIENDLY" | "PAYMENT";
  title: string;
  subtitle?: string;
  tone: "neutral" | "success" | "danger" | "warning" | "info";
  createdAt: string;
}

const STORAGE_KEY = "tp_admin_last_view";
const PAGE_SIZE = 20;

const toneColor: Record<FeedItem["tone"], string> = {
  neutral: "#6D2EC0",
  success: "#1FB87A",
  danger: "#E04545",
  warning: "#F0A030",
  info: "#1F4DB8",
};
const typeIcon: Record<FeedItem["type"], string> = {
  USER: "👤",
  TOURNAMENT: "🏆",
  FRIENDLY: "🤝",
  PAYMENT: "💳",
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [lastViewed, setLastViewed] = useState<number>(() => {
    if (typeof window === "undefined") return Date.now();
    return Number(localStorage.getItem(STORAGE_KEY) ?? 0);
  });
  const ref = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = useInfiniteQuery({
    queryKey: ["admin", "feed"],
    queryFn: ({ pageParam }) =>
      api.get<FeedItem[]>("admin/feed", {
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.flatMap((p) => p).length;
    },
    refetchInterval: 30_000,
  });

  const items = query.data?.pages.flatMap((p) => p) ?? [];
  const unread = items.filter((i) => new Date(i.createdAt).getTime() > lastViewed).length;
  const hasMore = Boolean(query.hasNextPage);

  // Infinite scroll dentro do popover
  useEffect(() => {
    if (!open) return;
    const node = sentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { root: node.parentElement, rootMargin: "100px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [open, query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function markRead() {
    const now = Date.now();
    setLastViewed(now);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, String(now));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          if (!open) markRead();
          setOpen((v) => !v);
        }}
        className="relative size-10 rounded-xl bg-page hover:bg-brand-50 flex items-center justify-center transition-colors"
        aria-label="Notificações"
      >
        <Bell size={17} color="#3D2C52" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold inline-flex items-center justify-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-brand-100 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
            <p className="font-display text-sm text-ink-900">NOTIFICAÇÕES</p>
            <span className="text-[11px] text-ink-500">{items.length} carregados</span>
          </div>

          <div className="max-h-[460px] overflow-y-auto">
            {items.length === 0 && !query.isLoading ? (
              <p className="px-4 py-8 text-center text-xs text-ink-500">
                Sem novidades nos últimos 30 dias.
              </p>
            ) : (
              items.map((it) => {
                const isNew = new Date(it.createdAt).getTime() > lastViewed;
                return (
                  <div
                    key={it.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-hairline last:border-b-0 ${
                      isNew ? "bg-brand-50/40" : ""
                    }`}
                  >
                    <span
                      className="size-9 rounded-xl shrink-0 inline-flex items-center justify-center text-base"
                      style={{ background: `${toneColor[it.tone]}15` }}
                    >
                      {typeIcon[it.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{it.title}</p>
                      {it.subtitle && (
                        <p className="text-[11px] text-ink-500 truncate">{it.subtitle}</p>
                      )}
                      <p className="text-[10px] text-ink-300 mt-0.5">
                        {formatRelative(it.createdAt)}
                      </p>
                    </div>
                    {isNew && (
                      <span className="size-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                );
              })
            )}

            <div ref={sentinelRef} className="py-2">
              {query.isFetchingNextPage && (
                <p className="text-center text-[11px] text-ink-500 inline-flex items-center justify-center gap-1.5 w-full">
                  <Loader2 size={11} className="animate-spin" /> Carregando mais…
                </p>
              )}
              {!hasMore && items.length > 0 && (
                <p className="text-center text-[11px] text-ink-300 py-1">Fim das notificações</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const days = Math.floor(h / 24);
  return `há ${days}d`;
}
