"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Selecione…",
  searchPlaceholder = "Buscar…",
  emptyText = "Nenhum resultado",
  disabled,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selected = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) =>
        [o.label, o.hint ?? ""].some((s) => s.toLowerCase().includes(query.toLowerCase())),
      )
    : options;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full h-10 px-3 rounded-xl bg-page border border-brand-100 focus:border-brand-500 outline-none text-sm text-ink-900",
          "inline-flex items-center justify-between gap-2 disabled:opacity-50",
          !selected && "text-ink-300",
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown size={14} className="text-ink-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white rounded-xl border border-brand-100 shadow-lg overflow-hidden">
          <div className="p-2 border-b border-hairline">
            <div className="flex items-center gap-2 px-2 h-8 rounded-lg bg-page">
              <Search size={13} className="text-ink-300" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-sm text-ink-900"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-ink-500">{emptyText}</p>
            )}
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "w-full text-left px-3 py-2 hover:bg-brand-50 flex items-center gap-2",
                  o.value === value && "bg-brand-50/50",
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-ink-900 truncate">{o.label}</span>
                  {o.hint && <span className="block text-[11px] text-ink-500 truncate">{o.hint}</span>}
                </span>
                {o.value === value && <Check size={14} color="#6D2EC0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
