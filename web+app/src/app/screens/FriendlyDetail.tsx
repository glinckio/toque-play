import { Calendar, Check, MapPin, Users, X } from 'lucide-react';
import { friendlies, currentUser } from '../data/mocks';
import { StatusBar } from '../components/StatusBar';
import { StatusBadge } from '../components/StatusBadge';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function FriendlyDetail({ id, nav }: { id?: string; nav: Nav }) {
  const f = friendlies.find((x) => x.id === id) ?? friendlies[0];
  const isRequester = f.requester.id === currentUser.id;
  const isChallenged = f.challenged?.id === currentUser.id;

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} className="pb-8 relative overflow-hidden">
        <div className="absolute -right-6 -top-6" style={{ fontFamily: 'Bebas Neue', fontSize: 160, color: 'rgba(255,255,255,0.06)', letterSpacing: 4 }}>VS</div>
        <StatusBar color="#FFFFFF" />
        <div className="px-5 pt-3 flex items-center justify-between">
          <button onClick={nav.back} className="size-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white" style={{ fontFamily: 'Bebas Neue' }}>←</button>
          <StatusBadge status={f.status} />
        </div>
        <div className="px-5 pt-5 text-white">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 30, letterSpacing: 0.4, lineHeight: 1 }}>{f.title ?? 'AMISTOSO'}</p>
          <div className="mt-3 flex items-center gap-3" style={{ fontFamily: 'Manrope', fontSize: 12 }}>
            <span className="inline-flex items-center gap-1"><Calendar size={13} />{new Date(f.date).toLocaleDateString('pt-BR')} {f.startTime}</span>
            <span className="inline-flex items-center gap-1"><MapPin size={13} />{f.city}/{f.state}</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5 relative">
        <div className="bg-white rounded-2xl p-5 shadow-[0_8px_24px_rgba(20,10,30,0.08)]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <SideTeam name={f.requesterTeam?.name ?? f.requester.name} role="Solicitante" avatar={f.requester.avatarUrl} />
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 26, color: '#6D2EC0', letterSpacing: 1 }}>VS</span>
            <SideTeam name={f.challengedTeam?.name ?? f.challenged?.name ?? '—'} role="Desafiado" avatar={f.challenged?.avatarUrl} />
          </div>
          {(f.scoreTeamA != null && f.scoreTeamB != null) && (
            <div className="mt-3 pt-3 border-t border-[#F4EFFA] flex items-center justify-center gap-4">
              <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#150A1F' }}>{f.scoreTeamA}</span>
              <span style={{ fontFamily: 'Manrope', fontSize: 12, color: '#A89BBA' }}>×</span>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#150A1F' }}>{f.scoreTeamB}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5 pb-40 space-y-4">
        <div className="bg-white rounded-2xl p-4">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.5 }}>DETALHES</p>
          <div className="mt-3 grid grid-cols-2 gap-3" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>
            <Detail k="Modalidade" v={f.modality === 'BEACH' ? 'Praia' : 'Quadra'} />
            <Detail k="Formato" v={f.categoryFormat} />
            <Detail k="Endereço" v={f.address ?? '—'} />
            <Detail k="Capitão" v={f.requester.name} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.5 }}>ATLETAS</p>
            <span className="inline-flex items-center gap-1" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}><Users size={13} />{f.athletesRequester.length + f.athletesChallenged.length}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <AthletesCol title="Solicitante" list={f.athletesRequester} />
            <AthletesCol title="Desafiado" list={f.athletesChallenged} />
          </div>
        </div>

        {f.description && (
          <div className="bg-white rounded-2xl p-4">
            <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#150A1F', letterSpacing: 0.5 }}>RECADO</p>
            <p className="mt-2" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#3D2C52', lineHeight: 1.6 }}>{f.description}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 bg-white/95 backdrop-blur border-t border-[#ECECF0]">
        {f.status === 'PENDING' && isChallenged && (
          <div className="flex gap-3">
            <ChevronButton variant="ghost" size="lg" icon={<X size={16} />}>Recusar</ChevronButton>
            <div className="flex-1"><ChevronButton variant="primary" size="lg" fullWidth icon={<Check size={16} />}>Aceitar</ChevronButton></div>
          </div>
        )}
        {f.status === 'PENDING' && isRequester && (
          <ChevronButton variant="ghost" size="lg" fullWidth>Cancelar amistoso</ChevronButton>
        )}
        {f.status === 'ACCEPTED' && (
          <ChevronButton variant="primary" size="lg" fullWidth onClick={() => f.matchId && nav.go('match', f.matchId)}>Iniciar partida</ChevronButton>
        )}
        {f.status === 'COMPLETED' && (
          <ChevronButton variant="ghost" size="lg" fullWidth onClick={() => f.matchId && nav.go('match', f.matchId)}>Ver resumo</ChevronButton>
        )}
        {(f.status === 'REJECTED' || f.status === 'CANCELLED') && (
          <ChevronButton variant="ghost" size="lg" fullWidth disabled>Indisponível</ChevronButton>
        )}
      </div>
    </div>
  );
}

function SideTeam({ name, role, avatar }: { name: string; role: string; avatar?: string }) {
  return (
    <div className="text-center">
      {avatar ? <img src={avatar} className="size-12 mx-auto rounded-2xl object-cover" /> : <div className="size-12 mx-auto rounded-2xl bg-[#F4EFFA]" />}
      <p className="mt-2" style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{name}</p>
      <p style={{ fontFamily: 'Manrope', fontSize: 10, color: '#A89BBA' }}>{role}</p>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p style={{ fontFamily: 'Manrope', fontSize: 10, color: '#A89BBA', letterSpacing: 0.3, textTransform: 'uppercase' }}>{k}</p>
      <p className="mt-0.5" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: '#150A1F' }}>{v}</p>
    </div>
  );
}

function AthletesCol({ title, list }: { title: string; list: { id: string; name: string; avatarUrl?: string }[] }) {
  return (
    <div>
      <p style={{ fontFamily: 'Manrope', fontSize: 10, color: '#A89BBA', letterSpacing: 0.3, textTransform: 'uppercase' }}>{title}</p>
      <div className="mt-2 space-y-2">
        {list.length === 0 && <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#A89BBA' }}>A definir</p>}
        {list.map((a) => (
          <div key={a.id} className="flex items-center gap-2">
            {a.avatarUrl ? <img src={a.avatarUrl} className="size-7 rounded-full" /> : <div className="size-7 rounded-full bg-[#F4EFFA]" />}
            <span style={{ fontFamily: 'Manrope', fontWeight: 500, fontSize: 12, color: '#150A1F' }}>{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
