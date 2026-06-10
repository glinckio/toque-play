interface Tab<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface Props<T extends string> {
  tabs: Tab<T>[];
  active: T;
  onChange: (t: T) => void;
  variant?: 'underline' | 'pill';
}

export function TabBar<T extends string>({ tabs, active, onChange, variant = 'underline' }: Props<T>) {
  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center p-1 rounded-full bg-[#F4EFFA]">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`px-4 py-1.5 rounded-full transition-colors`}
              style={{
                background: isActive ? '#6D2EC0' : 'transparent',
                color: isActive ? '#FFFFFF' : '#6B5B7E',
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-6 border-b border-[#ECECF0]">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className="relative pb-2"
            style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: 14, color: isActive ? '#150A1F' : '#6B5B7E' }}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span className="ml-1.5 px-1.5 rounded-full" style={{ background: isActive ? '#F4EFFA' : '#ECECF0', color: isActive ? '#6D2EC0' : '#6B5B7E', fontSize: 10 }}>
                {t.count}
              </span>
            )}
            <span
              className="absolute left-0 right-0 -bottom-px h-[2px] transition-colors"
              style={{ background: isActive ? '#6D2EC0' : 'transparent' }}
            />
          </button>
        );
      })}
    </div>
  );
}
