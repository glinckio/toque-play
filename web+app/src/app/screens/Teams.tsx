import { Plus } from 'lucide-react';
import { teams } from '../data/mocks';
import { HeroHeader } from '../components/HeroHeader';
import { StatusBar } from '../components/StatusBar';
import { TeamCard } from '../components/Cards';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function Teams({ nav }: { nav: Nav }) {
  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader title="MEUS TIMES" subtitle={`${teams.length} times sob seu comando`} watermark="TIMES" onBack={nav.back} rounded />
      <div className="px-5 py-6 space-y-3 pb-32">
        {teams.map((t) => (
          <TeamCard key={t.id} team={t} onClick={() => nav.go('team-detail', t.id)} />
        ))}
      </div>
      <div className="fixed bottom-24 right-5 z-30">
        <ChevronButton variant="primary" size="lg" icon={<Plus size={18} />}>Novo time</ChevronButton>
      </div>
    </div>
  );
}
