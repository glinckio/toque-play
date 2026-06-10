import { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#ECE6F4] ${className}`} style={{ boxShadow: '0 1px 0 rgba(20,10,30,0.02)' }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4EFFA]">
      <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#150A1F', letterSpacing: 0.8 }}>{title.toUpperCase()}</p>
      {action}
    </div>
  );
}

export function Kpi({ label, value, delta, icon, accent }: { label: string; value: string; delta?: number; icon?: ReactNode; accent?: string }) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 11, color: '#6B5B7E', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
        <div className="size-9 rounded-xl flex items-center justify-center" style={{ background: accent ?? '#F4EFFA' }}>{icon}</div>
      </div>
      <p className="mt-3" style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#150A1F', letterSpacing: 0.3, lineHeight: 1 }}>{value}</p>
      {delta != null && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: up ? '#E6F8EF' : '#FDECEC' }}>
          {up ? <ArrowUpRight size={12} color="#1FB87A" /> : <ArrowDownRight size={12} color="#E04545" />}
          <span style={{ fontSize: 11, fontWeight: 700, color: up ? '#0E7A4A' : '#B22424' }}>{up ? '+' : ''}{delta}%</span>
          <span style={{ fontSize: 11, color: '#6B5B7E' }}>vs. mês ant.</span>
        </div>
      )}
    </Card>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'danger' | 'warning' | 'info' }) {
  const map: Record<string, { bg: string; fg: string }> = {
    neutral: { bg: '#F4EFFA', fg: '#6D2EC0' },
    success: { bg: '#E6F8EF', fg: '#0E7A4A' },
    danger: { bg: '#FDECEC', fg: '#B22424' },
    warning: { bg: '#FFF3DE', fg: '#A05E00' },
    info: { bg: '#E6F0FE', fg: '#1F4DB8' },
  };
  const c = map[tone];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.fg, fontSize: 11, fontWeight: 700, letterSpacing: 0.2 }}>
      {children}
    </span>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13, color: '#150A1F' }}>{children}</table>
      </div>
    </Card>
  );
}

export function Th({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <th className={`text-left px-5 py-3 border-b border-[#F4EFFA] ${className}`} style={{ fontSize: 11, color: '#6B5B7E', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 700 }}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 border-b border-[#F4EFFA] ${className}`}>{children}</td>;
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3 mb-4">{children}</div>;
}

export function FilterChip({ active, onClick, children, count }: { active?: boolean; onClick?: () => void; children: ReactNode; count?: number }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors"
      style={{
        background: active ? '#6D2EC0' : '#FFF',
        color: active ? '#FFF' : '#3D2C52',
        borderColor: active ? '#6D2EC0' : '#ECE6F4',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
      {count != null && (
        <span className="px-1.5 rounded-md" style={{ fontSize: 10, background: active ? 'rgba(255,255,255,0.2)' : '#F4EFFA', color: active ? '#FFF' : '#6D2EC0', fontWeight: 700 }}>
          {count}
        </span>
      )}
    </button>
  );
}

export function PrimaryButton({ children, onClick, icon }: { children: ReactNode; onClick?: () => void; icon?: ReactNode }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl text-white hover:opacity-95" style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 12px rgba(109,46,192,0.25)' }}>
      {icon}{children}
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-[#ECE6F4] bg-white hover:bg-[#FAFAFA]" style={{ fontSize: 13, fontWeight: 600, color: '#3D2C52' }}>
      {children}
    </button>
  );
}
