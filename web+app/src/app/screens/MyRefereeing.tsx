import { Flag, KeyRound } from 'lucide-react';
import { currentUser, matches } from '../data/mocks';
import { HeroHeader } from '../components/HeroHeader';
import { StatusBar } from '../components/StatusBar';
import { MatchCard } from '../components/Cards';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function MyRefereeing({ nav }: { nav: Nav }) {
  const refereed = matches.filter((m) => m.refereeId === currentUser.id);

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#150A1F,#3D2C52)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader variant="dark" title="ARBITRAGENS" subtitle="Partidas que você comanda" watermark="ARBITRA" onBack={nav.back} rounded />
      <div className="px-5 py-5 pb-32 space-y-4">
        <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-[#F4EFFA]">
          <div className="size-11 rounded-xl bg-[#F4EFFA] flex items-center justify-center"><KeyRound size={20} color="#6D2EC0" /></div>
          <div className="flex-1">
            <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }}>Entrar com código</p>
            <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>Use o código de 6 dígitos do capitão</p>
          </div>
          <ChevronButton variant="primary" size="sm" onClick={() => nav.go('referee-enter')}>Entrar</ChevronButton>
        </div>

        <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#A89BBA', letterSpacing: 0.5 }}>EM ANDAMENTO</p>
        {refereed.map((m) => (
          <MatchCard key={m.id} match={m} onClick={() => nav.go('match', m.id)} />
        ))}
        {refereed.length === 0 && (
          <div className="py-10 text-center bg-white rounded-2xl">
            <Flag size={36} className="mx-auto mb-2" color="#A89BBA" />
            <p style={{ fontFamily: 'Manrope', fontSize: 13, color: '#6B5B7E' }}>Você ainda não arbitra nenhum jogo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
