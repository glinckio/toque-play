import { Crown, Trophy } from 'lucide-react';
import { teams } from '../data/mocks';
import { StatusBar } from '../components/StatusBar';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function TeamDetail({ id, nav }: { id?: string; nav: Nav }) {
  const t = teams.find((x) => x.id === id) ?? teams[0];
  const winRate = t.wins + t.losses > 0 ? Math.round((t.wins / (t.wins + t.losses)) * 100) : 0;

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} className="pb-10 relative overflow-hidden">
        <div className="absolute -right-4 top-6" style={{ fontFamily: 'Bebas Neue', fontSize: 140, color: 'rgba(255,255,255,0.07)', letterSpacing: 4 }}>{t.modality}</div>
        <StatusBar color="#FFFFFF" />
        <div className="px-5 pt-3 flex items-center justify-between">
          <button onClick={nav.back} className="size-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white" style={{ fontFamily: 'Bebas Neue' }}>←</button>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#FFF', letterSpacing: 0.6 }}>TIME</p>
          <span className="size-9" />
        </div>
        <div className="px-5 pt-5 text-white">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 34, letterSpacing: 0.3, lineHeight: 1 }}>{t.name}</p>
          <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{t.modality === 'BEACH' ? 'Vôlei de Praia' : 'Vôlei de Quadra'} · {t.members.length} atletas</p>
        </div>
      </div>

      <div className="px-5 -mt-6 relative">
        <div className="bg-white rounded-2xl p-4 grid grid-cols-3 gap-2 shadow-[0_8px_24px_rgba(20,10,30,0.08)]">
          <Stat label="Vitórias" value={String(t.wins)} />
          <Stat label="Derrotas" value={String(t.losses)} />
          <Stat label="Aproveit." value={`${winRate}%`} />
        </div>
      </div>

      <div className="px-5 py-5 pb-32 space-y-4">
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#A89BBA', letterSpacing: 0.5 }}>ATLETAS</p>
        <div className="bg-white rounded-2xl divide-y divide-[#F4EFFA]">
          {t.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-4">
              {m.avatarUrl ? <img src={m.avatarUrl} className="size-10 rounded-full" /> : <div className="size-10 rounded-full bg-[#F4EFFA]" />}
              <div className="flex-1">
                <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }}>{m.name}</p>
                <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{m.position ?? 'Atleta'}</p>
              </div>
              {m.isCaptain && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F4EFFA]" style={{ fontFamily: 'Bebas Neue', fontSize: 10, color: '#6D2EC0', letterSpacing: 0.5 }}>
                  <Crown size={10} />CAPITÃO
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#6D2EC0] to-[#4A1F87] rounded-2xl p-5 text-white flex items-center gap-3">
          <Trophy size={28} />
          <div className="flex-1">
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, letterSpacing: 0.5 }}>HISTÓRICO</p>
            <p style={{ fontFamily: 'Manrope', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{t.wins + t.losses} partidas disputadas</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 bg-white/95 backdrop-blur border-t border-[#ECECF0]">
        <ChevronButton variant="primary" size="lg" fullWidth>Gerenciar time</ChevronButton>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#6D2EC0', lineHeight: 1 }}>{value}</p>
      <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 10, color: '#6B5B7E', letterSpacing: 0.3 }}>{label}</p>
    </div>
  );
}
