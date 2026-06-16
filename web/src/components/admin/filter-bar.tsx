"use client";

import { ReactNode } from "react";
import { Filter, X } from "lucide-react";

export function FilterBar({
  groups,
  onClear,
}: {
  groups: { label: string; children: ReactNode; active?: boolean }[];
  onClear?: () => void;
}) {
  const anyActive = groups.some((g) => g.active);

  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-3 mb-4">
      <div className="flex items-center gap-3 mb-2 px-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-ink-500">
          <Filter size={12} /> Filtros
        </span>
        {anyActive && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11px] text-brand-700 hover:underline font-semibold"
          >
            <X size={11} /> Limpar tudo
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
        {groups.map((g, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-ink-300 pl-1">
              {g.label}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">{g.children}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 h-8 rounded-lg text-xs font-semibold border transition-colors ${
        active
          ? "bg-brand-500 text-white border-brand-500"
          : "bg-white text-ink-700 border-brand-100 hover:border-brand-300 hover:bg-brand-50/40"
      }`}
    >
      {children}
    </button>
  );
}
