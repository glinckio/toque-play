import { Bell, Search } from 'lucide-react';
import { AdminRoute } from './Sidebar';

const titles: Record<AdminRoute, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: 'Visão geral da plataforma' },
  users: { title: 'Usuários', sub: 'Gerencie contas e permissões' },
  tournaments: { title: 'Torneios', sub: 'Modere e acompanhe torneios da plataforma' },
  matches: { title: 'Partidas', sub: 'Histórico, ao vivo e arbitragens' },
  athletes: { title: 'Atletas', sub: 'Base de atletas registrados' },
  payments: { title: 'Pagamentos', sub: 'Transações processadas pelo Stripe' },
  settings: { title: 'Configurações', sub: 'Parâmetros do sistema' },
};

export function AdminTopbar({ route }: { route: AdminRoute }) {
  const t = titles[route];
  return (
    <header className="px-8 py-5 bg-white border-b border-[#ECE6F4] flex items-center gap-6">
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#150A1F', letterSpacing: 0.4, lineHeight: 1 }}>{t.title.toUpperCase()}</p>
        <p style={{ fontSize: 12, color: '#6B5B7E', marginTop: 4 }}>{t.sub}</p>
      </div>

      <div className="relative w-[320px]">
        <Search size={15} color="#A89BBA" className="absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Buscar usuário, torneio, pagamento..."
          className="w-full pl-9 pr-3 h-10 rounded-xl bg-[#F5F4F8] border border-transparent focus:border-[#6D2EC0] focus:bg-white outline-none transition-colors"
          style={{ fontSize: 13, color: '#150A1F' }}
        />
      </div>

      <button className="relative size-10 rounded-xl bg-[#F5F4F8] hover:bg-[#ECE6F4] flex items-center justify-center" aria-label="Notificações">
        <Bell size={17} color="#3D2C52" />
        <span className="absolute top-2 right-2 size-2 rounded-full bg-[#E04545]" />
      </button>
    </header>
  );
}
