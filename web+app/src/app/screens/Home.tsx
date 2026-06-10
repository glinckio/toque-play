import { ArrowRight, Bell, ChevronRight, Plus, Trophy, Users } from 'lucide-react';
import { currentUser, friendlies, matches, notifications, tournaments } from '../data/mocks';
import { ChevronButton } from '../components/ChevronButton';
import { MatchCard, TournamentCard, FriendlyCard } from '../components/Cards';
import { StatusBar } from '../components/StatusBar';
import { Nav } from '../router';

export function Home({ nav }: { nav: Nav }) {
  const upcoming = matches.filter((m) => m.status !== 'FINISHED').slice(0, 2);
  const featured = tournaments.filter((t) => t.status === 'REGISTRATION_OPEN' || t.status === 'IN_PROGRESS');
  const pendingFriendlies = friendlies.filter((f) => f.status === 'PENDING');
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0 0%,#4A1F87 100%)' }} className="relative overflow-hidden rounded-b-[32px] pb-7">
        <p aria-hidden className="absolute -right-6 top-12 select-none pointer-events-none" style={{ fontFamily: 'Bebas Neue', fontSize: 140, color: '#FFF', opacity: 0.07, letterSpacing: 2, lineHeight: 1 }}>OLÁ</p>
        <StatusBar color="#FFFFFF" />
        <div className="px-5 flex items-center justify-between mt-2">
          <p style={{ fontFamily: 'Azeret Mono', fontWeight: 700, fontSize: 14, color: '#FFF', letterSpacing: -0.5 }}>TOQUEPLAY</p>
          <button onClick={() => nav.go('notifications')} className="relative size-9 rounded-full bg-white/15 flex items-center justify-center">
            <Bell size={18} color="#FFF" />
            {unread > 0 && <span className="absolute top-0 right-0 size-2.5 rounded-full bg-[#FF5050] ring-2 ring-[#4A1F87]" />}
          </button>
        </div>
        <div className="px-5 pt-7 flex items-center gap-3">
          <img src={currentUser.avatarUrl} alt="" className="size-14 rounded-full ring-2 ring-white/30 object-cover" />
          <div>
            <p style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Bom dia,</p>
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#FFF', lineHeight: 1, letterSpacing: 0.3 }}>{currentUser.name.split(' ')[0]} 👋</p>
          </div>
        </div>
        <div className="px-5 mt-6 grid grid-cols-3 gap-2.5">
          <Quick label="Criar Torneio" icon={<Trophy size={16} color="#FFF" />} onClick={() => nav.go('create-tournament')} />
          <Quick label="Criar Amistoso" icon={<Plus size={16} color="#FFF" />} onClick={() => nav.go('create-friendly')} />
          <Quick label="Sou Árbitro" icon={<Users size={16} color="#FFF" />} onClick={() => nav.go('referee-enter')} />
        </div>
      </div>

      <div className="px-5 pt-6 pb-32 space-y-7">
        <Section title="Próximos jogos" cta="Ver todos" onCta={() => nav.go('matches')}>
          <div className="space-y-3">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} onClick={() => nav.go('match', m.id)} />
            ))}
          </div>
        </Section>

        {pendingFriendlies.length > 0 && (
          <Section title="Amistosos pendentes" cta="Ver todos" onCta={() => nav.go('explore')}>
            <div className="space-y-3">
              {pendingFriendlies.map((f) => (
                <FriendlyCard key={f.id} friendly={f} onClick={() => nav.go('friendly', f.id)} />
              ))}
            </div>
          </Section>
        )}

        <Section title="Torneios em destaque" cta="Explorar" onCta={() => nav.go('explore')}>
          <div className="space-y-3">
            {featured.map((t) => (
              <TournamentCard key={t.id} tournament={t} onClick={() => nav.go('tournament', t.id)} />
            ))}
          </div>
        </Section>

        <div className="bg-gradient-to-br from-[#150A1F] to-[#3D2C52] rounded-2xl p-5 text-white">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, lineHeight: 1.1, letterSpacing: 0.3 }}>VAI ARBITRAR<br/>UMA PARTIDA?</p>
          <p className="mt-2 mb-4" style={{ fontFamily: 'Manrope', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Insira o código de 6 dígitos para começar.</p>
          <ChevronButton variant="primary" size="md" onClick={() => nav.go('referee-enter')}>Inserir código</ChevronButton>
        </div>
      </div>
    </div>
  );
}

function Quick({ label, icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-white/12 backdrop-blur rounded-xl p-3 text-left active:bg-white/20">
      <div className="size-7 rounded-md bg-white/20 flex items-center justify-center">{icon}</div>
      <p className="mt-2" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 11, color: '#FFF', lineHeight: 1.2 }}>{label}</p>
    </button>
  );
}

function Section({ title, cta, onCta, children }: { title: string; cta?: string; onCta?: () => void; children: any }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 20, color: '#150A1F', letterSpacing: 0.3 }}>{title}</p>
        {cta && (
          <button onClick={onCta} className="flex items-center gap-0.5" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: '#6D2EC0' }}>
            {cta} <ChevronRight size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
