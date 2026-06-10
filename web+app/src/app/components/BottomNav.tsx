import { Bell, Compass, Home, Plus, User } from 'lucide-react';

export type TabKey = 'home' | 'explore' | 'create' | 'notifications' | 'profile';

interface Props {
  active: TabKey;
  onChange: (t: TabKey) => void;
  unread?: number;
}

const items: { key: TabKey; icon: typeof Home; label: string }[] = [
  { key: 'home', icon: Home, label: 'Início' },
  { key: 'explore', icon: Compass, label: 'Explorar' },
  { key: 'create', icon: Plus, label: 'Criar' },
  { key: 'notifications', icon: Bell, label: 'Avisos' },
  { key: 'profile', icon: User, label: 'Perfil' },
];

export function BottomNav({ active, onChange, unread = 0 }: Props) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[358px] z-40">
      <div
        className="flex items-center justify-between px-3 py-2 rounded-full shadow-[0_8px_30px_rgba(109,46,192,0.18)]"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
      >
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          const isCenter = it.key === 'create';

          if (isCenter) {
            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                className="size-12 rounded-full flex items-center justify-center -mt-6 shadow-[0_6px_16px_rgba(109,46,192,0.45)]"
                style={{ background: 'linear-gradient(135deg,#6D2EC0,#A674F0)' }}
                aria-label="Criar"
              >
                <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1 min-w-[44px]"
              aria-label={it.label}
            >
              <Icon size={22} color={isActive ? '#6D2EC0' : '#6B5B7E'} fill={isActive ? '#F4EFFA' : 'none'} strokeWidth={isActive ? 2.2 : 1.8} />
              <span
                style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 10, color: isActive ? '#6D2EC0' : '#6B5B7E' }}
              >
                {it.label}
              </span>
              {it.key === 'notifications' && unread > 0 && (
                <span className="absolute top-0 right-1 size-4 rounded-full bg-[#E04545] text-white flex items-center justify-center" style={{ fontSize: 9, fontFamily: 'Manrope', fontWeight: 700 }}>
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
