import { useMemo, useState } from 'react';
import { Check, CreditCard, Crown, ExternalLink, Lock, ShieldCheck } from 'lucide-react';
import { currentUser, registrations, teams, tournaments } from '../data/mocks';
import { StatusBar } from '../components/StatusBar';
import { Stepper } from '../components/Stepper';
import { ChevronButton } from '../components/ChevronButton';
import { StatusBadge } from '../components/StatusBadge';
import { Nav } from '../router';
import { Category } from '../data/types';

const steps = ['Categoria', 'Time', 'Atletas', 'Capitão', 'Pagamento'];

export function TournamentRegister({ id, nav }: { id?: string; nav: Nav }) {
  const t = tournaments.find((x) => x.id === id) ?? tournaments[0];
  const [step, setStep] = useState(0);
  const [categoryId, setCategoryId] = useState<string>(t.categories[0]?.id ?? '');
  const [teamId, setTeamId] = useState<string>('');
  const [athleteIds, setAthleteIds] = useState<string[]>([]);
  const [captainId, setCaptainId] = useState<string>('');
  const [done, setDone] = useState(false);

  const category = useMemo<Category | undefined>(() => t.categories.find((c) => c.id === categoryId), [categoryId, t]);
  const myTeams = useMemo(() => teams.filter((tm) => tm.ownerId === currentUser.id && (!category || tm.modality === category.modality)), [category]);
  const selectedTeam = teams.find((tm) => tm.id === teamId);

  const usedAthleteIds = useMemo(() => {
    return new Set(
      registrations
        .filter((r) => r.tournamentId === t.id && r.categoryId === categoryId && r.teamId === teamId)
        .flatMap((r) => r.athleteIds),
    );
  }, [t.id, categoryId, teamId]);

  const requiredAthletes = category ? (category.format === 'PAIR' ? 2 : category.format === 'QUARTET' ? 4 : 6) : 2;

  const toggleAthlete = (mid: string) => {
    if (usedAthleteIds.has(mid)) return;
    setAthleteIds((prev) =>
      prev.includes(mid) ? prev.filter((x) => x !== mid) : prev.length < requiredAthletes ? [...prev, mid] : prev,
    );
  };

  const canNext = () => {
    if (step === 0) return !!categoryId;
    if (step === 1) return !!teamId;
    if (step === 2) return athleteIds.length === requiredAthletes;
    if (step === 3) return !!captainId && athleteIds.includes(captainId);
    return true;
  };

  const next = () => {
    if (!canNext()) return;
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  };
  const prev = () => (step > 0 ? setStep(step - 1) : nav.back());

  if (done) return <SuccessView tournamentName={t.name} onDone={() => nav.back()} />;

  return (
    <div className="min-h-full bg-[#FAFAFA] pb-32">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} className="pb-6">
        <StatusBar color="#FFFFFF" />
        <div className="px-5 pt-3 flex items-center justify-between">
          <button onClick={prev} className="size-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white" style={{ fontFamily: 'Bebas Neue' }}>←</button>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#FFF', letterSpacing: 0.6 }}>INSCRIÇÃO</p>
          <span className="size-9" />
        </div>
        <div className="px-5 pt-4 text-white">
          <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{t.name}</p>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 0.3 }}>{steps[step].toUpperCase()}</p>
        </div>
        <div className="px-5 mt-4"><Stepper steps={steps} current={step} /></div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {step === 0 && (
          <div className="space-y-3">
            {t.categories.map((c) => (
              <button key={c.id} onClick={() => { setCategoryId(c.id); setTeamId(''); setAthleteIds([]); setCaptainId(''); }} className={`w-full text-left rounded-2xl p-4 border ${categoryId === c.id ? 'bg-[#F4EFFA] border-[#6D2EC0]' : 'bg-white border-[#ECECF0]'}`}>
                <div className="flex items-center justify-between">
                  <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#150A1F', letterSpacing: 0.4 }}>
                    {c.type} · {c.format} · {c.modality === 'BEACH' ? 'PRAIA' : 'QUADRA'}
                  </p>
                  {c.registrationPrice ? (
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#6D2EC0' }}>R$ {c.registrationPrice}</span>
                  ) : (
                    <span style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#1FB87A' }}>GRÁTIS</span>
                  )}
                </div>
                <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>{c.bracketType.replace(/_/g, ' ')} · Melhor de {c.bestOfSets}</p>
              </button>
            ))}
            {t.categories.length === 0 && (
              <p className="text-center py-10" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#A89BBA' }}>Esse torneio ainda não tem categorias.</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {myTeams.map((tm) => (
              <button key={tm.id} onClick={() => { setTeamId(tm.id); setAthleteIds([]); setCaptainId(''); }} className={`w-full text-left rounded-2xl p-4 border ${teamId === tm.id ? 'bg-[#F4EFFA] border-[#6D2EC0]' : 'bg-white border-[#ECECF0]'}`}>
                <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }}>{tm.name}</p>
                <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{tm.modality === 'BEACH' ? 'Praia' : 'Quadra'} · {tm.members.length} atletas</p>
              </button>
            ))}
            {myTeams.length === 0 && (
              <p className="text-center py-10" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#A89BBA' }}>Nenhum time compatível com essa modalidade.</p>
            )}
            <div className="bg-[#F4EFFA] rounded-2xl p-4">
              <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, color: '#6D2EC0' }}>Pode inscrever o mesmo time mais de uma vez</p>
              <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>Só não pode repetir atletas usados em outra inscrição desta categoria.</p>
            </div>
          </div>
        )}

        {step === 2 && selectedTeam && (
          <>
            <div className="flex items-center justify-between">
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>SELECIONE {requiredAthletes} ATLETAS</p>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, color: athleteIds.length === requiredAthletes ? '#1FB87A' : '#6D2EC0' }}>{athleteIds.length}/{requiredAthletes}</span>
            </div>
            <div className="bg-white rounded-2xl divide-y divide-[#F4EFFA]">
              {selectedTeam.members.map((m) => {
                const used = usedAthleteIds.has(m.id);
                const picked = athleteIds.includes(m.id);
                return (
                  <button key={m.id} disabled={used} onClick={() => toggleAthlete(m.id)} className={`w-full flex items-center gap-3 p-3 ${used ? 'opacity-50' : ''}`}>
                    {m.avatarUrl ? <img src={m.avatarUrl} className="size-10 rounded-full" /> : <div className="size-10 rounded-full bg-[#F4EFFA]" />}
                    <div className="flex-1 text-left">
                      <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{m.name}</p>
                      <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{m.position ?? 'Atleta'}{used && ' · já inscrito em outra leva'}</p>
                    </div>
                    <span className={`size-6 rounded-full flex items-center justify-center ${picked ? 'bg-[#6D2EC0]' : 'bg-[#F4EFFA]'}`}>
                      {picked ? <Check size={14} color="#FFF" /> : used ? <Lock size={12} color="#A89BBA" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 3 && selectedTeam && (
          <>
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>QUEM SERÁ O CAPITÃO?</p>
            <div className="bg-white rounded-2xl divide-y divide-[#F4EFFA]">
              {athleteIds.map((aid) => {
                const m = selectedTeam.members.find((mm) => mm.id === aid)!;
                const isCap = captainId === aid;
                return (
                  <button key={aid} onClick={() => setCaptainId(aid)} className="w-full flex items-center gap-3 p-3">
                    {m.avatarUrl ? <img src={m.avatarUrl} className="size-10 rounded-full" /> : <div className="size-10 rounded-full bg-[#F4EFFA]" />}
                    <div className="flex-1 text-left">
                      <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{m.name}</p>
                      <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{m.position ?? 'Atleta'}</p>
                    </div>
                    <span className={`size-6 rounded-full flex items-center justify-center ${isCap ? 'bg-[#6D2EC0]' : 'border border-[#ECECF0]'}`}>
                      {isCap && <Crown size={14} color="#FFF" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 4 && category && (
          <>
            <div className="bg-white rounded-2xl p-4 space-y-2">
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>RESUMO</p>
              <Row k="Categoria" v={`${category.type} · ${category.format} · ${category.modality === 'BEACH' ? 'PRAIA' : 'QUADRA'}`} />
              <Row k="Time" v={selectedTeam?.name ?? '—'} />
              <Row k="Atletas" v={String(athleteIds.length)} />
              <Row k="Capitão" v={selectedTeam?.members.find((m) => m.id === captainId)?.name ?? '—'} />
            </div>

            {category.registrationPrice ? (
              <>
                <div className="bg-white rounded-2xl p-4">
                  <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>PAGAMENTO</p>
                  <div className="mt-3">
                    <div className="flex items-center gap-3 rounded-2xl p-3 border bg-[#F4EFFA] border-[#6D2EC0]">
                      <div className="size-10 rounded-xl bg-white flex items-center justify-center border border-[#ECECF0]">
                        <CreditCard size={18} color="#6D2EC0" />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>Cartão de crédito</p>
                        <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>Único método disponível</p>
                      </div>
                      <span className="size-5 rounded-full bg-[#6D2EC0] flex items-center justify-center">
                        <Check size={12} color="#FFF" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#FAFAFA] p-3 border border-[#ECECF0]">
                    <ExternalLink size={14} color="#6D2EC0" className="mt-0.5" />
                    <div>
                      <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 12, color: '#150A1F' }}>Pagamento via Stripe</p>
                      <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E', lineHeight: 1.4 }}>
                        Você será direcionado ao checkout seguro do Stripe em uma janela do app. Após confirmar o pagamento, voltamos automaticamente.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5" style={{ fontFamily: 'Manrope', fontSize: 11, color: '#A89BBA' }}>
                    <Lock size={11} />
                    Conexão criptografada · Cartão processado pelo Stripe
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#6D2EC0] to-[#4A1F87] rounded-2xl p-5 text-white flex items-end justify-between">
                  <div>
                    <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Total</p>
                    <p style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: 0.3, lineHeight: 1 }}>R$ {category.registrationPrice}</p>
                  </div>
                  <span style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Inscrição única</span>
                </div>
              </>
            ) : (
              <div className="bg-[#E6F8EF] rounded-2xl p-4 flex items-center gap-3">
                <ShieldCheck size={20} color="#1FB87A" />
                <div>
                  <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#0E7A4A' }}>Inscrição gratuita</p>
                  <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#1FB87A' }}>Nenhum pagamento necessário.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 bg-white/95 backdrop-blur border-t border-[#ECECF0] flex gap-3">
        <ChevronButton variant="ghost" size="lg" onClick={prev}>Voltar</ChevronButton>
        <div className="flex-1">
          <ChevronButton variant="primary" size="lg" fullWidth onClick={next} disabled={!canNext()}>
            {step === steps.length - 1 ? (category?.registrationPrice ? `Abrir Stripe · R$ ${category.registrationPrice}` : 'Confirmar inscrição') : 'Avançar'}
          </ChevronButton>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>{k}</span>
      <span className="text-right" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: '#150A1F' }}>{v}</span>
    </div>
  );
}

function SuccessView({ tournamentName, onDone }: { tournamentName: string; onDone: () => void }) {
  return (
    <div className="min-h-full" style={{ background: 'linear-gradient(180deg,#6D2EC0 0%,#4A1F87 100%)' }}>
      <StatusBar color="#FFFFFF" />
      <div className="px-5 pt-20 pb-10 text-white text-center">
        <div className="size-20 mx-auto rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center">
          <Check size={40} color="#FFF" strokeWidth={3} />
        </div>
        <p className="mt-6" style={{ fontFamily: 'Bebas Neue', fontSize: 36, letterSpacing: 0.4, lineHeight: 1 }}>INSCRIÇÃO CONFIRMADA</p>
        <p className="mt-3" style={{ fontFamily: 'Manrope', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{tournamentName}</p>
        <div className="mt-6 inline-block">
          <StatusBadge status="REGISTRATION_OPEN" />
        </div>
      </div>
      <div className="px-5 mt-6">
        <ChevronButton variant="secondary" size="lg" fullWidth onClick={onDone}>Voltar ao torneio</ChevronButton>
      </div>
    </div>
  );
}
