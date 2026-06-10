import { useState } from 'react';
import { Filter, MapPin, Search } from 'lucide-react';
import { friendlies, tournaments } from '../data/mocks';
import { FriendlyCard, TournamentCard } from '../components/Cards';
import { TabBar } from '../components/TabBar';
import { StatusBar } from '../components/StatusBar';
import { Nav } from '../router';

type Tab = 'tournaments' | 'friendlies';

export function Explore({ nav }: { nav: Nav }) {
  const [tab, setTab] = useState<Tab>('tournaments');
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState<'ALL' | 'BEACH' | 'COURT'>('ALL');

  const filteredTournaments = tournaments
    .filter((t) => t.isPublished)
    .filter((t) => modality === 'ALL' || t.modality === modality)
    .filter((t) => !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.city.toLowerCase().includes(query.toLowerCase()));

  const filteredFriendlies = friendlies
    .filter((f) => f.status === 'PENDING' || f.status === 'ACCEPTED')
    .filter((f) => modality === 'ALL' || f.modality === modality)
    .filter((f) => !query || f.city.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <StatusBar />
      <div className="px-5 pt-2 pb-5">
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 30, color: '#150A1F', letterSpacing: 0.3, lineHeight: 1 }}>EXPLORAR</p>
        <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#6B5B7E' }}>Encontre torneios e amistosos perto de você</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white border border-[#ECECF0] rounded-xl px-3 h-11">
            <Search size={16} color="#A89BBA" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou cidade"
              className="flex-1 outline-none bg-transparent"
              style={{ fontFamily: 'Manrope', fontSize: 13, color: '#150A1F' }}
            />
          </div>
          <button className="size-11 rounded-xl bg-[#6D2EC0] flex items-center justify-center shadow-[0_4px_12px_rgba(109,46,192,0.3)]">
            <Filter size={18} color="#FFF" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#ECECF0]" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 11, color: '#6B5B7E' }}>
            <MapPin size={11} /> Florianópolis
          </span>
          {(['ALL', 'BEACH', 'COURT'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModality(m)}
              className="px-3 py-1 rounded-full"
              style={{
                background: modality === m ? '#6D2EC0' : '#FFF',
                color: modality === m ? '#FFF' : '#6B5B7E',
                border: modality === m ? 'none' : '1px solid #ECECF0',
                fontFamily: 'Manrope',
                fontWeight: 600,
                fontSize: 11,
              }}
            >
              {m === 'ALL' ? 'Todos' : m === 'BEACH' ? 'Praia' : 'Quadra'}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <TabBar<Tab>
            tabs={[
              { key: 'tournaments', label: 'Torneios', count: filteredTournaments.length },
              { key: 'friendlies', label: 'Amistosos', count: filteredFriendlies.length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
      </div>

      <div className="px-5 pb-32 space-y-3">
        {tab === 'tournaments'
          ? filteredTournaments.map((t) => <TournamentCard key={t.id} tournament={t} onClick={() => nav.go('tournament', t.id)} />)
          : filteredFriendlies.map((f) => <FriendlyCard key={f.id} friendly={f} onClick={() => nav.go('friendly', f.id)} />)}
        {(tab === 'tournaments' ? filteredTournaments : filteredFriendlies).length === 0 && (
          <div className="py-12 text-center" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#A89BBA' }}>
            Nada encontrado por aqui.
          </div>
        )}
      </div>
    </div>
  );
}
