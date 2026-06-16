"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";

interface Props {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}

export function DateRangeFilter({ from, to, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const hasFilter = Boolean(from || to);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 px-3 h-8 rounded-lg border text-xs font-semibold transition-colors ${
          hasFilter
            ? "bg-brand-500 text-white border-brand-500"
            : "bg-white text-ink-700 border-brand-100 hover:bg-brand-50"
        }`}
      >
        <Calendar size={14} />
        Datas
        {hasFilter && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onChange({ from: "", to: "" });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                onChange({ from: "", to: "" });
              }
            }}
            className="inline-flex items-center justify-center size-5 rounded-full bg-white/20 hover:bg-white/30"
          >
            <X size={11} />
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1 bg-white rounded-xl border border-brand-100 shadow-lg p-3 space-y-2 w-64"
          onMouseLeave={() => setOpen(false)}
        >
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-1">
              De
            </span>
            <input
              type="date"
              value={from}
              onChange={(e) => onChange({ from: e.target.value, to })}
              className="w-full h-9 px-2 rounded-lg bg-page border border-brand-100 outline-none text-xs text-ink-900"
            />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-1">
              Até
            </span>
            <input
              type="date"
              value={to}
              onChange={(e) => onChange({ from, to: e.target.value })}
              className="w-full h-9 px-2 rounded-lg bg-page border border-brand-100 outline-none text-xs text-ink-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
