import { ChevronRight, Flag, LogOut, Settings, Trophy, Users } from 'lucide-react';
import { currentUser, teams, tournaments } from '../data/mocks';
import { StatusBar } from '../components/StatusBar';
import { HeroHeader } from '../components/HeroHeader';
import { Nav } from '../router';

export function Profile({ nav, onLogout }: { nav: Nav; onLogout: () => void }) {
  const myTournaments = tournaments.filter((t) => t.organizer.id === currentUser.id).length;
  const myTeams = teams.filter((t) => t.ownerId === currentUser.id).length;

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader title="MEU PERFIL" subtitle="Gerencie times, torneios e arbitragens" watermark="PERFIL" rounded />

      <div className="px-5 -mt-12 relative">
        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(20,10,30,0.08)] flex items-center gap-4">
          <img src={currentUser.avatarUrl} alt="" className="size-16 rounded-2xl object-cover" />
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 17, color: '#150A1F' }}>{currentUser.name}</p>
            <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>{currentUser.email}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#F4EFFA]" style={{ fontFamily: 'Bebas Neue', fontSize: 10, color: '#6D2EC0', letterSpacing: 0.5 }}>
              {currentUser.role}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Times" value={myTeams} />
          <Stat label="Torneios" value={myTournaments} />
          <Stat label="Vitórias" value={36} />
        </div>
      </div>

      <div className="px-5 mt-7 pb-32">
        <p className="mb-3" style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#A89BBA', letterSpacing: 0.5 }}>GERENCIAR</p>
        <div className="bg-white rounded-2xl divide-y divide-[#F4EFFA]">
          <Item icon={<Users size={18} color="#6D2EC0" />} label="Meus times" sub={`${myTeams} times`} onClick={() => nav.go('teams')} />
          <Item icon={<Trophy size={18} color="#6D2EC0" />} label="Torneios que organizo" sub={`${myTournaments} torneios`} onClick={() => nav.go('my-tournaments')} />
          <Item icon={<Flag size={18} color="#6D2EC0" />} label="Minhas arbitragens" sub="1 ativa" onClick={() => nav.go('my-refereeing')} />
        </div>

        <p className="mt-7 mb-3" style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#A89BBA', letterSpacing: 0.5 }}>CONTA</p>
        <div className="bg-white rounded-2xl divide-y divide-[#F4EFFA]">
          <Item icon={<Settings size={18} color="#6D2EC0" />} label="Configurações" sub="Notificações, privacidade" />
          <Item icon={<LogOut size={18} color="#E04545" />} label="Sair" sub="Encerrar a sessão" onClick={onLogout} danger />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl py-3 text-center shadow-[0_2px_10px_rgba(20,10,30,0.05)]">
      <p style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: '#6D2EC0', lineHeight: 1 }}>{value}</p>
      <p className="mt-0.5" style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 11, color: '#6B5B7E' }}>{label}</p>
    </div>
  );
}

function Item({ icon, label, sub, onClick, danger }: { icon: any; label: string; sub?: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-4 active:bg-[#FAFAFA]">
      <div className="size-9 rounded-xl bg-[#F4EFFA] flex items-center justify-center">{icon}</div>
      <div className="flex-1 text-left">
        <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: danger ? '#E04545' : '#150A1F' }}>{label}</p>
        {sub && <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#A89BBA' }}>{sub}</p>}
      </div>
      <ChevronRight size={18} color="#A89BBA" />
    </button>
  );
}
