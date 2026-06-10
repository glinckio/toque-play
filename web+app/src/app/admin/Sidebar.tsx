import { CreditCard, Flag, LayoutDashboard, LogOut, Settings, Swords, Trophy, Users, Volleyball } from 'lucide-react';

export type AdminRoute =
  | 'dashboard'
  | 'users'
  | 'tournaments'
  | 'matches'
  | 'athletes'
  | 'payments'
  | 'settings';

const items: { key: AdminRoute; label: string; icon: typeof LayoutDashboard; section?: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Visão geral' },
  { key: 'tournaments', label: 'Torneios', icon: Trophy, section: 'Operação' },
  { key: 'matches', label: 'Partidas', icon: Swords },
  { key: 'athletes', label: 'Atletas', icon: Volleyball },
  { key: 'users', label: 'Usuários', icon: Users, section: 'Gestão' },
  { key: 'payments', label: 'Pagamentos', icon: CreditCard },
  { key: 'settings', label: 'Configurações', icon: Settings, section: 'Sistema' },
];

export function AdminSidebar({ active, onChange, onExit }: { active: AdminRoute; onChange: (r: AdminRoute) => void; onExit: () => void }) {
  return (
    <aside className="w-[248px] shrink-0 flex flex-col text-white" style={{ background: 'linear-gradient(180deg,#1A0E2A 0%,#3D2C52 100%)' }}>
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/5">
        <div className="size-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6D2EC0,#A674F0)' }}>
          <Flag size={18} color="#FFF" strokeWidth={2.4} />
        </div>
        <div>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 1.5 }}>TOQUEPLAY</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.6, textTransform: 'uppercase' }}>Admin Console</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.key;
          return (
            <div key={it.key}>
              {it.section && (
                <p className="px-3 pt-4 pb-2" style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>{it.section}</p>
              )}
              <button
                onClick={() => onChange(it.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                style={{ color: isActive ? '#FFF' : 'rgba(255,255,255,0.7)' }}
              >
                {isActive && <span className="absolute left-0 w-1 h-5 rounded-r bg-[#A674F0]" />}
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
                <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{it.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop" className="size-9 rounded-full object-cover" />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 12, fontWeight: 700, color: '#FFF' }}>Lucas Andrade</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Super Admin</p>
          </div>
          <button onClick={onExit} className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center" aria-label="Sair">
            <LogOut size={15} color="rgba(255,255,255,0.7)" />
          </button>
        </div>
      </div>
    </aside>
  );
}
