import { useState } from 'react';
import { Image as ImageIcon, MapPin } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { Stepper } from '../components/Stepper';
import { Input } from '../components/Input';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

const steps = ['Básico', 'Estrutura', 'Categorias', 'Mídia', 'Revisar'];

export function CreateTournament({ nav }: { nav: Nav }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    description: '',
    modality: 'BEACH',
    eventType: 'SINGLE',
    city: '',
    state: '',
    startDate: '',
    bracketType: 'SINGLE_ELIMINATION',
    bestOfSets: 3,
    tiebreakScore: 15,
    price: '',
  });
  const set = (k: keyof typeof form, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const next = () => (step < steps.length - 1 ? setStep(step + 1) : nav.go('my-tournaments'));
  const prev = () => (step > 0 ? setStep(step - 1) : nav.back());

  return (
    <div className="min-h-full bg-[#FAFAFA] pb-32">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }} className="pb-6">
        <StatusBar color="#FFFFFF" />
        <div className="px-5 pt-3 flex items-center justify-between">
          <button onClick={prev} className="size-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white" style={{ fontFamily: 'Bebas Neue' }}>←</button>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#FFF', letterSpacing: 0.6 }}>NOVO TORNEIO</p>
          <button onClick={() => nav.back()} className="size-9" />
        </div>
        <div className="px-5 mt-4">
          <Stepper steps={steps} current={step} />
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {step === 0 && (
          <>
            <SectionTitle>Identificação</SectionTitle>
            <Input label="Nome do torneio" placeholder="Ex.: Copa Beach Verão" value={form.name} onChange={(e) => set('name', e.target.value)} />
            <Input label="Descrição" placeholder="Resumo do evento" value={form.description} onChange={(e) => set('description', e.target.value)} />
            <SectionTitle>Localização</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Cidade" placeholder="Florianópolis" value={form.city} onChange={(e) => set('city', e.target.value)} icon={<MapPin size={16} color="#A89BBA" />} />
              <Input label="UF" placeholder="SC" value={form.state} onChange={(e) => set('state', e.target.value)} />
            </div>
            <Input label="Data de início" placeholder="DD/MM/AAAA" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
          </>
        )}

        {step === 1 && (
          <>
            <SectionTitle>Modalidade</SectionTitle>
            <Pills value={form.modality} onChange={(v) => set('modality', v)} options={[{ k: 'BEACH', l: 'Praia' }, { k: 'COURT', l: 'Quadra' }]} />
            <SectionTitle>Formato do evento</SectionTitle>
            <Pills value={form.eventType} onChange={(v) => set('eventType', v)} options={[{ k: 'SINGLE', l: 'Único' }, { k: 'CIRCUIT', l: 'Circuito' }]} />
            <SectionTitle>Tipo de chave</SectionTitle>
            <div className="grid grid-cols-1 gap-2">
              {[
                { k: 'SINGLE_ELIMINATION', l: 'Eliminatória simples' },
                { k: 'DOUBLE_ELIMINATION', l: 'Dupla eliminação' },
                { k: 'ROUND_ROBIN', l: 'Pontos corridos' },
                { k: 'GROUPS_THEN_ELIMINATION', l: 'Grupos + Mata-mata' },
              ].map((o) => (
                <button key={o.k} onClick={() => set('bracketType', o.k)} className={`text-left rounded-2xl px-4 py-3 border ${form.bracketType === o.k ? 'bg-[#F4EFFA] border-[#6D2EC0]' : 'bg-white border-[#ECECF0]'}`} style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: '#150A1F' }}>
                  {o.l}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle>Regras de partida</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Melhor de" placeholder="3" value={String(form.bestOfSets)} onChange={(e) => set('bestOfSets', Number(e.target.value) || 3)} />
              <Input label="Tiebreak" placeholder="15" value={String(form.tiebreakScore)} onChange={(e) => set('tiebreakScore', Number(e.target.value) || 15)} />
            </div>
            <SectionTitle>Inscrição</SectionTitle>
            <Input label="Valor (R$)" placeholder="0 para gratuito" value={form.price} onChange={(e) => set('price', e.target.value)} />
            <div className="bg-[#F4EFFA] rounded-2xl p-4">
              <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#6D2EC0' }}>Adicione categorias após publicar</p>
              <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>Você poderá definir categorias por gênero, formato e modalidade no detalhe do torneio.</p>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle>Capa do torneio</SectionTitle>
            <button className="w-full h-44 rounded-2xl bg-white border-2 border-dashed border-[#D9C9F0] flex flex-col items-center justify-center gap-2">
              <ImageIcon size={28} color="#6D2EC0" />
              <p style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: '#6D2EC0' }}>Enviar imagem</p>
              <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#A89BBA' }}>JPG ou PNG até 5MB</p>
            </button>
            <SectionTitle>Patrocinadores</SectionTitle>
            <button className="w-full bg-white rounded-2xl py-3" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: '#6D2EC0' }}>+ Adicionar patrocinador</button>
          </>
        )}

        {step === 4 && (
          <>
            <SectionTitle>Revisão</SectionTitle>
            <div className="bg-white rounded-2xl p-4 space-y-2">
              <Row k="Nome" v={form.name || '—'} />
              <Row k="Local" v={`${form.city || '—'}/${form.state || '—'}`} />
              <Row k="Modalidade" v={form.modality === 'BEACH' ? 'Praia' : 'Quadra'} />
              <Row k="Formato" v={form.eventType === 'CIRCUIT' ? 'Circuito' : 'Único'} />
              <Row k="Chave" v={form.bracketType.replace(/_/g, ' ')} />
              <Row k="Melhor de" v={String(form.bestOfSets)} />
              <Row k="Inscrição" v={form.price ? `R$ ${form.price}` : 'Grátis'} />
            </div>
            <div className="bg-gradient-to-br from-[#6D2EC0] to-[#4A1F87] rounded-2xl p-5 text-white">
              <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 0.5 }}>PRONTO PARA PUBLICAR?</p>
              <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Depois de publicar, abre as inscrições para os atletas.</p>
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] px-5 py-4 bg-white/95 backdrop-blur border-t border-[#ECECF0] flex gap-3">
        <ChevronButton variant="ghost" size="lg" onClick={prev}>Voltar</ChevronButton>
        <div className="flex-1">
          <ChevronButton variant="primary" size="lg" fullWidth onClick={next}>
            {step === steps.length - 1 ? 'Publicar' : 'Avançar'}
          </ChevronButton>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>{children}</p>;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>{k}</span>
      <span className="text-right" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: '#150A1F' }}>{v}</span>
    </div>
  );
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
