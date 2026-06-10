import { useState } from 'react';
import { Copy, KeyRound, Timer } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { HeroHeader } from '../components/HeroHeader';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

export function RefereeEnter({ nav }: { nav: Nav }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const setAt = (i: number, v: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(v)) return;
    setCode((c) => c.map((x, j) => (j === i ? v.toUpperCase() : x)));
  };

  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#150A1F,#3D2C52)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader variant="dark" title="ENTRAR" subtitle="Use o código de 6 dígitos do capitão" watermark="ÁRBITRO" onBack={nav.back} rounded />

      <div className="px-5 py-8 space-y-6">
        <div className="bg-white rounded-3xl p-6 text-center">
          <div className="size-14 mx-auto rounded-2xl bg-[#F4EFFA] flex items-center justify-center mb-3"><KeyRound size={24} color="#6D2EC0" /></div>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#150A1F', letterSpacing: 0.4 }}>CÓDIGO DE ACESSO</p>
          <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>Solicite ao capitão do time</p>

          <div className="mt-5 flex justify-center gap-2">
            {code.map((c, i) => (
              <input
                key={i}
                value={c}
                onChange={(e) => setAt(i, e.target.value)}
                maxLength={1}
                className="size-12 rounded-xl bg-[#F4EFFA] text-center border-2 border-transparent focus:border-[#6D2EC0] outline-none"
                style={{ fontFamily: 'Bebas Neue', fontSize: 24, color: '#150A1F' }}
              />
            ))}
          </div>
        </div>

        <ChevronButton variant="primary" size="lg" fullWidth onClick={() => nav.go('match', 'm1')}>Entrar na partida</ChevronButton>
        <p className="text-center" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#A89BBA' }}>O código expira em 24 horas após a geração.</p>
      </div>
    </div>
  );
}

export function RefereeCode({ nav }: { nav: Nav }) {
  const code = 'X4K9PM';
  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader title="CÓDIGO ÁRBITRO" subtitle="Compartilhe com o árbitro" watermark="CÓDIGO" onBack={nav.back} rounded />

      <div className="px-5 py-8 space-y-5">
        <div className="bg-gradient-to-br from-[#6D2EC0] to-[#4A1F87] rounded-3xl p-8 text-center text-white">
          <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Seu código</p>
          <p className="mt-2" style={{ fontFamily: 'Bebas Neue', fontSize: 56, letterSpacing: 8, color: '#FFF' }}>{code}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15" style={{ fontFamily: 'Manrope', fontSize: 11 }}>
            <Timer size={12} />Expira em 23h 58min
          </div>
        </div>

        <ChevronButton variant="secondary" size="lg" fullWidth icon={<Copy size={16} />}>Copiar código</ChevronButton>

        <div className="bg-white rounded-2xl p-4">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#A89BBA', letterSpacing: 0.5 }}>COMO USAR</p>
          <ol className="mt-2 space-y-2" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#3D2C52' }}>
            <li>1. Envie o código ao árbitro</li>
            <li>2. Ele acessa "Sou Árbitro" no app</li>
            <li>3. Insere o código e entra na partida</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
