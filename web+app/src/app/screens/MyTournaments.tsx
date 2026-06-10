import { useState } from 'react';
import { Plus } from 'lucide-react';
import { currentUser, tournaments } from '../data/mocks';
import { HeroHeader } from '../components/HeroHeader';
import { StatusBar } from '../components/StatusBar';
import { TabBar } from '../components/TabBar';
import { TournamentCard } from '../components/Cards';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';
import { TournamentStatus } from '../data/types';

type Tab = 'draft' | 'live' | 'finished';
const map: Record<Tab, TournamentStatus[]> = {
  draft: ['DRAFT'],
  live: ['PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'BRACKET_GENERATED', 'IN_PROGRESS'],
  finished: ['FINISHED', 'CANCELLED'],
};

export function MyTournaments({ nav }: { nav: Nav }) {
  const [tab, setTab] = useState<Tab>('live');
  const mine = tournaments.filter((t) => t.organizer.id === currentUser.id);
  const filtered = mine.filter((t) => map[tab].includes(t.status));

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader title="MEUS TORNEIOS" subtitle="Torneios que você organiza" watermark="ORGANIZA" onBack={nav.back} rounded />
      <div className="px-5 pt-5">
        <TabBar<Tab>
          tabs={[
            { key: 'draft', label: 'Rascunho', count: mine.filter((t) => map.draft.includes(t.status)).length },
            { key: 'live', label: 'Ativos', count: mine.filter((t) => map.live.includes(t.status)).length },
            { key: 'finished', label: 'Finalizados', count: mine.filter((t) => map.finished.includes(t.status)).length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>
      <div className="px-5 py-5 space-y-3 pb-32">
        {filtered.map((t) => (
          <TournamentCard key={t.id} tournament={t} onClick={() => nav.go('tournament', t.id)} />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#A89BBA' }}>Nenhum torneio nessa categoria.</div>
        )}
      </div>
      <div className="fixed bottom-24 right-5 z-30">
        <ChevronButton variant="primary" size="lg" icon={<Plus size={18} />} onClick={() => nav.go('create-tournament')}>Novo torneio</ChevronButton>
      </div>
    </div>
  );
}
