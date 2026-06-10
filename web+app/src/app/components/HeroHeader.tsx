import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  watermark?: string;
  onBack?: () => void;
  right?: ReactNode;
  variant?: 'primary' | 'dark';
  rounded?: boolean;
}

export function HeroHeader({ title, subtitle, watermark, onBack, right, variant = 'primary', rounded }: Props) {
  const bg = variant === 'primary' ? '#6D2EC0' : '#150A1F';
  const accent = variant === 'primary' ? '#4A1F87' : '#3D2C52';
  return (
    <div
      className={`relative overflow-hidden ${rounded ? 'rounded-b-[32px]' : ''}`}
      style={{ background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`, paddingTop: 48 }}
    >
      <p
        aria-hidden
        className="absolute right-[-20px] top-[40px] pointer-events-none select-none whitespace-nowrap"
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 128,
          color: '#FFFFFF',
          opacity: 0.08,
          letterSpacing: 2,
          lineHeight: 1,
        }}
      >
        {watermark ?? title}
      </p>
      <div className="relative flex items-center justify-between px-4 pt-3">
        {onBack ? (
          <button onClick={onBack} className="size-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center" aria-label="Voltar">
            <ChevronLeft size={20} color="#FFFFFF" />
          </button>
        ) : (
          <div />
        )}
        <p style={{ fontFamily: 'Azeret Mono, monospace', letterSpacing: '-0.5px', fontSize: 14, color: '#FFFFFF' }} className="font-semibold uppercase">
          TOQUEPLAY
        </p>
        <div className="min-w-9 flex justify-end">{right}</div>
      </div>
      <div className="relative px-5 pt-8 pb-7">
        <p style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, lineHeight: 1, color: '#FFFFFF', letterSpacing: 0.5 }}>
          {title}
        </p>
        {subtitle && (
          <p className="mt-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.78)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
