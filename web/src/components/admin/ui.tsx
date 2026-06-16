import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("bg-white rounded-2xl border border-brand-100", className)}
      style={{ boxShadow: "0 1px 0 rgba(20,10,30,0.02)" }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
      <p className="font-display text-sm text-ink-900">{title.toUpperCase()}</p>
      {action}
    </div>
  );
}

export function Kpi({
  label,
  value,
  delta,
  icon,
  accent,
}: {
  label: string;
  value: string;
  delta?: number;
  icon?: ReactNode;
  accent?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-ink-500 uppercase font-semibold tracking-wide">{label}</p>
        <div
          className="size-9 rounded-xl flex items-center justify-center"
          style={{ background: accent ?? "#F4EFFA" }}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 font-display text-[32px] leading-none text-ink-900">{value}</p>
      {delta != null && (
        <div
          className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: up ? "#E6F8EF" : "#FDECEC" }}
        >
          {up ? <ArrowUpRight size={12} color="#1FB87A" /> : <ArrowDownRight size={12} color="#E04545" />}
          <span className="text-[11px] font-bold" style={{ color: up ? "#0E7A4A" : "#B22424" }}>
            {up ? "+" : ""}
            {delta}%
          </span>
          <span className="text-[11px] text-ink-500">vs. mês ant.</span>
        </div>
      )}
    </Card>
  );
}

type PillTone = "neutral" | "success" | "danger" | "warning" | "info";

const pillToneMap: Record<PillTone, { bg: string; fg: string }> = {
  neutral: { bg: "#F4EFFA", fg: "#6D2EC0" },
  success: { bg: "#E6F8EF", fg: "#0E7A4A" },
  danger: { bg: "#FDECEC", fg: "#B22424" },
  warning: { bg: "#FFF3DE", fg: "#A05E00" },
  info: { bg: "#E6F0FE", fg: "#1F4DB8" },
};

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: PillTone }) {
  const c = pillToneMap[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}
    >
      {children}
    </span>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-ink-900">{children}</table>
      </div>
    </Card>
  );
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn("text-left px-5 py-3 border-b border-hairline", className)}
      style={{ fontSize: 11, color: "#6B5B7E", letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 700 }}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className = "",
  colSpan,
}: {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td className={cn("px-5 py-3.5 border-b border-hairline", className)} colSpan={colSpan}>
      {children}
    </td>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3 mb-4 flex-wrap">{children}</div>;
}

export function FilterChip({
  active,
  onClick,
  children,
  count,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors"
      style={{
        background: active ? "#6D2EC0" : "#FFF",
        color: active ? "#FFF" : "#3D2C52",
        borderColor: active ? "#6D2EC0" : "#ECE6F4",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
      {count != null && (
        <span
          className="px-1.5 rounded-md font-bold"
          style={{
            fontSize: 10,
            background: active ? "rgba(255,255,255,0.2)" : "#F4EFFA",
            color: active ? "#FFF" : "#6D2EC0",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 h-10 rounded-xl text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg,#6D2EC0,#4A1F87)",
        fontSize: 13,
        fontWeight: 700,
        boxShadow: "0 4px 12px rgba(109,46,192,0.25)",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  type = "button",
  disabled,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-brand-100 bg-white hover:bg-brand-50 disabled:opacity-50 text-ink-700"
      style={{ fontSize: 13, fontWeight: 600 }}
    >
      {children}
    </button>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="font-display text-base text-ink-900">{title}</p>
      {hint && <p className="text-xs text-ink-500 mt-1">{hint}</p>}
    </div>
  );
}
