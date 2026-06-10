import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { teams, users, currentUser } from '../data/mocks';
import { StatusBar } from '../components/StatusBar';
import { Input } from '../components/Input';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function CreateFriendly({ nav }: { nav: Nav }) {
  const myTeams = teams.filter((t) => t.ownerId === currentUser.id);
  const [form, setForm] = useState({
    title: 'Amistoso de fim de semana',
    date: '',
    time: '',
    city: '',
    state: '',
    address: '',
    modality: 'BEACH',
    format: 'PAIR',
    teamId: myTeams[0]?.id ?? '',
    challengedId: users[1]?.id ?? '',
  });
  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="min-h-full bg-[#FAFAFA] pb-32">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} className="pb-6">
        <StatusBar color="#FFFFFF" />
        <div className="px-5 pt-3 flex items-center justify-between">
          <button onClick={nav.back} className="size-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white" style={{ fontFamily: 'Bebas Neue' }}>←</button>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#FFF', letterSpacing: 0.6 }}>NOVO AMISTOSO</p>
          <span className="size-9" />
        </div>
        <div className="px-5 pt-3 text-white">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: 0.3 }}>DESAFIE UM TIME</p>
          <p style={{ fontFamily: 'Manrope', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Defina data, local e atletas. O time desafiado precisa aceitar.</p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        <Input label="Título" placeholder="Ex.: Beach do sábado" value={form.title} onChange={(e) => set('title', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Data" placeholder="DD/MM" value={form.date} onChange={(e) => set('date', e.target.value)} icon={<Calendar size={16} color="#A89BBA" />} />
          <Input label="Horário" placeholder="19:30" value={form.time} onChange={(e) => set('time', e.target.value)} icon={<Clock size={16} color="#A89BBA" />} />
        </div>
        <Input label="Endereço" placeholder="Av. Beira-Mar, 100" value={form.address} onChange={(e) => set('address', e.target.value)} icon={<MapPin size={16} color="#A89BBA" />} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Cidade" placeholder="Florianópolis" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <Input label="UF" placeholder="SC" value={form.state} onChange={(e) => set('state', e.target.value)} />
        </div>

        <SectionTitle>Modalidade</SectionTitle>
        <Pills value={form.modality} onChange={(v) => set('modality', v)} options={[{ k: 'BEACH', l: 'Praia' }, { k: 'COURT', l: 'Quadra' }]} />

        <SectionTitle>Formato</SectionTitle>
        <Pills value={form.format} onChange={(v) => set('format', v)} options={[{ k: 'PAIR', l: 'Dupla' }, { k: 'QUARTET', l: 'Quarteto' }, { k: 'SEXTET', l: 'Sexteto' }]} />

        <SectionTitle>Seu time</SectionTitle>
        <div className="space-y-2">
          {myTeams.map((t) => (
            <button key={t.id} onClick={() => set('teamId', t.id)} className={`w-full text-left rounded-2xl px-4 py-3 border ${form.teamId === t.id ? 'bg-[#F4EFFA] border-[#6D2EC0]' : 'bg-white border-[#ECECF0]'}`}>
              <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }}>{t.name}</p>
              <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{t.modality === 'BEACH' ? 'Praia' : 'Quadra'} · {t.members.length} atletas</p>
            </button>
          ))}
        </div>

        <SectionTitle>Desafiar</SectionTitle>
        <div className="space-y-2">
          {users.filter((u) => u.id !== currentUser.id).map((u) => (
            <button key={u.id} onClick={() => set('challengedId', u.id)} className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 border ${form.challengedId === u.id ? 'bg-[#F4EFFA] border-[#6D2EC0]' : 'bg-white border-[#ECECF0]'}`}>
              <img src={u.avatarUrl} className="size-9 rounded-full" />
              <div className="flex-1 text-left">
                <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{u.name}</p>
                <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{u.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 bg-white/95 backdrop-blur border-t border-[#ECECF0]">
        <ChevronButton variant="primary" size="lg" fullWidth onClick={() => nav.go('home')}>Enviar desafio</ChevronButton>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>{children}</p>;
}

function Pills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { k: string; l: string }[] }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button key={o.k} onClick={() => onChange(o.k)} className={`flex-1 rounded-full py-2.5 ${value === o.k ? 'bg-[#6D2EC0] text-white' : 'bg-white text-[#150A1F] border border-[#ECECF0]'}`} style={{ fontFamily: 'Bebas Neue', fontSize: 14, letterSpacing: 0.5 }}>
          {o.l}
        </button>
      ))}
    </div>
  );
}
