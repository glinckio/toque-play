import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const fills: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: '#6D2EC0', text: '#FFFFFF' },
  secondary: { bg: '#150A1F', text: '#FFFFFF' },
  ghost: { bg: '#F4EFFA', text: '#6D2EC0' },
  danger: { bg: '#E04545', text: '#FFFFFF' },
  success: { bg: '#1FB87A', text: '#FFFFFF' },
  dark: { bg: '#3D2C52', text: '#FFFFFF' },
};

const sizes: Record<Size, { h: number; px: string; fs: string; cap: number }> = {
  sm: { h: 28, px: 'px-3', fs: 'text-[12px]', cap: 7 },
  md: { h: 40, px: 'px-4', fs: 'text-[14px]', cap: 10 },
  lg: { h: 48, px: 'px-5', fs: 'text-[16px]', cap: 12 },
};

export function ChevronButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  icon,
}: Props) {
  const c = disabled ? { bg: '#D6D5D5', text: '#8D8D8D' } : fills[variant];
  const s = sizes[size];
  const cap = s.cap;
  const h = s.h;

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`inline-flex items-stretch ${fullWidth ? 'w-full' : ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer active:opacity-80'} transition-opacity`}
      style={{ height: h }}
    >
      <svg width={cap} height={h} viewBox={`0 0 ${cap} ${h}`} preserveAspectRatio="none">
        <path d={`M${cap} 0 L0 ${h / 2} L${cap} ${h} Z`} fill={c.bg} />
      </svg>
      <span
        className={`flex-1 ${fullWidth ? '' : 'min-w-0'} ${s.px} ${s.fs} inline-flex items-center justify-center gap-2 whitespace-nowrap`}
        style={{ backgroundColor: c.bg, color: c.text, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.5px' }}
      >
        {icon}
        {children}
      </span>
      <svg width={cap} height={h} viewBox={`0 0 ${cap} ${h}`} preserveAspectRatio="none">
        <path d={`M0 0 L${cap} ${h / 2} L0 ${h} Z`} fill={c.bg} />
      </svg>
    </button>
  );
}
