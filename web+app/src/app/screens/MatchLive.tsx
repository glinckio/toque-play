import { useState } from 'react';
import { Minus, Plus, Repeat, Timer, Trophy } from 'lucide-react';
import { matches } from '../data/mocks';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function MatchLive({ id, nav }: { id?: string; nav: Nav }) {
  const initial = matches.find((m) => m.id === id) ?? matches[0];
  const [sets, setSets] = useState(initial.sets.length ? initial.sets : [{ setNumber: 1, scoreA: 0, scoreB: 0, finished: false }]);
  const current = sets[sets.length - 1];
  const setsWonA = sets.filter((s) => s.finished && s.scoreA > s.scoreB).length;
  const setsWonB = sets.filter((s) => s.finished && s.scoreB > s.scoreA).length;

  const updateScore = (side: 'A' | 'B', delta: number) => {
    setSets((prev) => {
      const next = [...prev];
      const last = { ...next[next.length - 1] };
      if (side === 'A') last.scoreA = Math.max(0, last.scoreA + delta);
      else last.scoreB = Math.max(0, last.scoreB + delta);
      next[next.length - 1] = last;
      return next;
    });
  };

  const finishSet = () => {
    setSets((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], finished: true };
      next.push({ setNumber: next.length + 1, scoreA: 0, scoreB: 0, finished: false });
      return next;
    });
  };

  return (
    <div className="min-h-full" style={{ background: 'linear-gradient(180deg,#150A1F 0%,#3D2C52 100%)' }}>
      <StatusBar color="#FFFFFF" />
      <div className="px-5 pt-3 flex items-center justify-between">
        <button onClick={nav.back} className="size-9 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white" style={{ fontFamily: 'Bebas Neue' }}>←</button>
        <StatusBadge status="IN_PROGRESS" />
        <span className="inline-flex items-center gap-1 text-white/80" style={{ fontFamily: 'Manrope', fontSize: 12 }}><Timer size={13} />Set {current.setNumber}</span>
      </div>

      <div className="px-5 mt-4 text-center text-white">
        <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{initial.tournamentName ?? 'Amistoso'}</p>
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 20, letterSpacing: 0.5 }}>{initial.label ?? 'Partida ao vivo'}</p>
      </div>

      <div className="px-5 mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamSide name={initial.teamA.name} sets={setsWonA} />
        <span style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: 'rgba(255,255,255,0.4)' }}>VS</span>
        <TeamSide name={initial.teamB.name} sets={setsWonB} right />
      </div>

      <div className="px-5 mt-2 grid grid-cols-2 gap-3">
        <ScoreBox value={current.scoreA} onAdd={() => updateScore('A', 1)} onRemove={() => updateScore('A', -1)} />
        <ScoreBox value={current.scoreB} onAdd={() => updateScore('B', 1)} onRemove={() => updateScore('B', -1)} />
      </div>

      <div className="px-5 mt-5">
        <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>SETS</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sets.map((s) => (
              <div key={s.setNumber} className={`px-3 py-1.5 rounded-xl ${s.finished ? 'bg-[#6D2EC0]' : 'bg-white/15'}`} style={{ fontFamily: 'Bebas Neue', fontSize: 13, color: '#FFF', letterSpacing: 0.5 }}>
                {s.setNumber}: {s.scoreA}–{s.scoreB}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 grid grid-cols-3 gap-2">
        <ActionChip icon={<Timer size={16} />} label="Timeout" />
        <ActionChip icon={<Repeat size={16} />} label="Subst." />
        <ActionChip icon={<Trophy size={16} />} label="WO" />
      </div>

      <div className="px-5 mt-6 pb-10 space-y-3">
        <ChevronButton variant="primary" size="lg" fullWidth onClick={finishSet}>Encerrar set</ChevronButton>
        <ChevronButton variant="ghost" size="lg" fullWidth>Finalizar partida</ChevronButton>
      </div>
    </div>
  );
}

function TeamSide({ name, sets, right }: { name: string; sets: number; right?: boolean }) {
  return (
    <div className={`text-${right ? 'right' : 'left'} text-white`}>
      <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: 0.4 }}>{name}</p>
      <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Sets vencidos: {sets}</p>
    </div>
  );
}

function ScoreBox({ value, onAdd, onRemove }: { value: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
      <button onClick={onAdd} className="w-full pt-6 pb-3" style={{ fontFamily: 'Bebas Neue', fontSize: 72, color: '#FFF', lineHeight: 1 }}>
        {value}
      </button>
      <div className="grid grid-cols-2 border-t border-white/10">
        <button onClick={onRemove} className="py-2.5 flex items-center justify-center text-white/80 border-r border-white/10"><Minus size={16} /></button>
        <button onClick={onAdd} className="py-2.5 flex items-center justify-center text-white"><Plus size={16} /></button>
      </div>
    </div>
  );
}

function ActionChip({ icon, label }: { icon: any; label: string }) {
  return (
    <button className="bg-white/10 backdrop-blur rounded-xl py-3 flex flex-col items-center gap-1 text-white border border-white/10">
      {icon}
      <span style={{ fontFamily: 'Manrope', fontSize: 11 }}>{label}</span>
    </button>
  );
}
