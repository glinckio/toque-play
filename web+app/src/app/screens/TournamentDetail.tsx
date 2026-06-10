import { useState } from 'react';
import { Calendar, MapPin, Trophy, Users, Volleyball } from 'lucide-react';
import { currentUser, registrations, tournaments } from '../data/mocks';
import { HeroHeader } from '../components/HeroHeader';
import { StatusBar } from '../components/StatusBar';
import { TabBar } from '../components/TabBar';
import { ChevronButton } from '../components/ChevronButton';
import { StatusBadge } from '../components/StatusBadge';
import { Nav } from '../router';

type Tab = 'overview' | 'categories' | 'bracket' | 'sponsors';

export function TournamentDetail({ id, nav }: { id?: string; nav: Nav }) {
  const t = tournaments.find((x) => x.id === id) ?? tournaments[0];
  const [tab, setTab] = useState<Tab>('overview');
  const myRegs = registrations.filter((r) => r.tournamentId === t.id && r.userId === currentUser.id);
  const isRegistered = myRegs.length > 0;
  const isRegisteredIn = (categoryId: string) => myRegs.some((r) => r.categoryId === categoryId);

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0" style={{ background: t.coverUrl ? `url(${t.coverUrl}) center/cover` : 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,10,30,0.4) 0%, rgba(20,10,30,0) 30%, rgba(20,10,30,0.9) 100%)' }} />
        <StatusBar color="#FFFFFF" />
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <button onClick={nav.back} className="size-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center" style={{ fontFamily: 'Bebas Neue', color: '#FFF' }}>←</button>
          <StatusBadge status={t.status} />
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 34, lineHeight: 1, color: '#FFF', letterSpacing: 0.3 }}>{t.name}</p>
          <div className="mt-2.5 flex items-center gap-3 text-white/80" style={{ fontFamily: 'Manrope', fontSize: 12 }}>
            <span className="inline-flex items-center gap-1"><Calendar size={13} />{new Date(t.startDate).toLocaleDateString('pt-BR')}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={13} />{t.city}/{t.state}</span>
            <span className="inline-flex items-center gap-1"><Users size={13} />{t.participantsCount}</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-3 relative">
        <div className="bg-white rounded-2xl p-4 grid grid-cols-3 gap-2 shadow-[0_8px_24px_rgba(20,10,30,0.08)]">
          <Stat label="Modalidade" value={t.modality === 'BEACH' ? 'Praia' : 'Quadra'} />
          <Stat label="Formato" value={t.eventType === 'CIRCUIT' ? 'Circuito' : 'Único'} />
          <Stat label="Categorias" value={String(t.categories.length)} />
        </div>
      </div>

      <div className="px-5 pt-5">
        <TabBar<Tab>
          tabs={[
            { key: 'overview', label: 'Visão geral' },
            { key: 'categories', label: 'Categorias' },
            { key: 'bracket', label: 'Chaves' },
            { key: 'sponsors', label: 'Patroc.' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="px-5 py-5 pb-40 space-y-4">
        {tab === 'overview' && (
          <>
            <p style={{ fontFamily: 'Manrope', fontSize: 14, color: '#3D2C52', lineHeight: 1.6 }}>{t.description}</p>
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.5 }}>ETAPAS</p>
              {t.stages.length === 0 && <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#A89BBA' }}>Sem etapas cadastradas.</p>}
              {t.stages.map((s, i) => (
                <div key={s.id} className="flex items-start gap-3 pb-3 border-b border-[#F4EFFA] last:border-b-0 last:pb-0">
                  <div className="size-9 rounded-xl bg-[#F4EFFA] flex items-center justify-center" style={{ fontFamily: 'Bebas Neue', color: '#6D2EC0', fontSize: 14 }}>{i + 1}</div>
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }}>{s.name ?? `Etapa ${i + 1}`}</p>
                    <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>
                      {new Date(s.date).toLocaleDateString('pt-BR')} · {s.startTime} · {s.city}/{s.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-[#6D2EC0] to-[#4A1F87] rounded-2xl p-5 text-white">
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 0.3 }}>ORGANIZADOR</p>
              <div className="mt-2 flex items-center gap-3">
                <img src={t.organizer.avatarUrl} className="size-10 rounded-full" />
                <div>
                  <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14 }}>{t.organizer.name}</p>
                  <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{t.organizer.email}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'categories' && (
          <div className="space-y-3">
            {t.categories.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#150A1F', letterSpacing: 0.4 }}>
                      {c.type} · {c.format} · {c.modality === 'BEACH' ? 'PRAIA' : 'QUADRA'}
                    </p>
                    <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>{c.bracketType.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-1 rounded-full bg-[#F4EFFA]" style={{ fontFamily: 'Bebas Neue', fontSize: 12, color: '#6D2EC0' }}>{c.registrationsCount ?? 0} insc.</span>
                    {isRegisteredIn(c.id) && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E6F8EF]" style={{ fontFamily: 'Bebas Neue', fontSize: 11, color: '#1FB87A', letterSpacing: 0.4 }}>✓ INSCRITO</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3" style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>
                  <span>Melhor de {c.bestOfSets}</span>
                  <span>Tiebreak {c.tiebreakScore}</span>
                  {c.registrationPrice ? <span>R$ {c.registrationPrice}</span> : <span style={{ color: '#1FB87A' }}>Grátis</span>}
                </div>
              </div>
            ))}
            {t.categories.length === 0 && (
              <div className="py-10 text-center" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#A89BBA' }}>Sem categorias ainda.</div>
            )}
          </div>
        )}

        {tab === 'bracket' && <BracketView />}

        {tab === 'sponsors' && (
          <div className="grid grid-cols-2 gap-3">
            {t.sponsors.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-5 text-center">
                <div className="size-14 mx-auto rounded-2xl bg-[#F4EFFA] flex items-center justify-center mb-2"><Trophy color="#6D2EC0" /></div>
                <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{s.name}</p>
              </div>
            ))}
            {t.sponsors.length === 0 && (
              <div className="col-span-2 py-10 text-center" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#A89BBA' }}>Nenhum patrocinador.</div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 bg-white/95 backdrop-blur border-t border-[#ECECF0]">
        {t.status === 'REGISTRATION_OPEN' && (
          isRegistered ? (
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-full bg-[#E6F8EF]">
                <span className="size-6 rounded-full bg-[#1FB87A] flex items-center justify-center" style={{ fontFamily: 'Bebas Neue', color: '#FFF', fontSize: 14 }}>✓</span>
                <div>
                  <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#0E7A4A', letterSpacing: 0.5, lineHeight: 1 }}>VOCÊ ESTÁ INSCRITO</p>
                  <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#1FB87A' }}>{myRegs.length} {myRegs.length === 1 ? 'categoria' : 'categorias'}</p>
                </div>
              </div>
              <ChevronButton variant="ghost" size="lg" onClick={() => nav.go('tournament-register', t.id)}>Nova leva</ChevronButton>
            </div>
          ) : (
            <ChevronButton variant="primary" size="lg" fullWidth onClick={() => nav.go('tournament-register', t.id)}>Inscrever meu time</ChevronButton>
          )
        )}
        {t.status === 'IN_PROGRESS' && <ChevronButton variant="primary" size="lg" fullWidth onClick={() => nav.go('match', 'm1')}>Acompanhar partidas</ChevronButton>}
        {t.status === 'DRAFT' && <ChevronButton variant="secondary" size="lg" fullWidth>Continuar configuração</ChevronButton>}
        {(t.status === 'FINISHED' || t.status === 'CANCELLED') && <ChevronButton variant="ghost" size="lg" fullWidth>Ver resultados</ChevronButton>}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#6D2EC0', lineHeight: 1 }}>{value}</p>
      <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 10, color: '#6B5B7E', letterSpacing: 0.3 }}>{label}</p>
    </div>
  );
}

function BracketView() {
  const rounds = [
    { name: 'Quartas', matches: [['Praia Brava', 'Tubarões FC'], ['Tigres', 'Lobos'], ['Falcões', 'Águias'], ['Ondas', 'Areia']] },
    { name: 'Semis', matches: [['Praia Brava', 'Tigres'], ['Águias', 'Areia']] },
    { name: 'Final', matches: [['Praia Brava', 'Areia']] },
  ];
  return (
    <div className="overflow-x-auto -mx-5 px-5 pb-2">
      <div className="flex gap-3 min-w-max">
        {rounds.map((r) => (
          <div key={r.name} className="w-44 flex-shrink-0">
            <p className="mb-2" style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#6D2EC0', letterSpacing: 0.5 }}>{r.name}</p>
            <div className="space-y-3">
              {r.matches.map((m, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#F4EFFA]">
                  <div className="px-3 py-2 flex justify-between items-center border-b border-[#F4EFFA]">
                    <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: '#150A1F' }}>{m[0]}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#6D2EC0' }}>2</span>
                  </div>
                  <div className="px-3 py-2 flex justify-between items-center">
                    <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 12, color: '#6B5B7E' }}>{m[1]}</span>
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA' }}>0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
