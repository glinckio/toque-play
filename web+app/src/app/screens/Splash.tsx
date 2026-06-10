import { Volleyball } from 'lucide-react';
import { useEffect } from 'react';

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="size-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#6D2EC0 0%,#4A1F87 60%,#150A1F 100%)' }}>
      <p aria-hidden className="absolute -right-12 top-16 select-none" style={{ fontFamily: 'Bebas Neue', fontSize: 220, color: '#FFF', opacity: 0.06, letterSpacing: 4 }}>PLAY</p>
      <p aria-hidden className="absolute -left-10 bottom-24 select-none" style={{ fontFamily: 'Bebas Neue', fontSize: 220, color: '#FFF', opacity: 0.06, letterSpacing: 4 }}>TOQUE</p>
      <div className="size-24 rounded-3xl flex items-center justify-center mb-6 shadow-[0_20px_60px_rgba(166,116,240,0.5)]" style={{ background: 'linear-gradient(135deg,#A674F0,#6D2EC0)' }}>
        <Volleyball size={52} color="#FFF" />
      </div>
      <p style={{ fontFamily: 'Azeret Mono, monospace', fontWeight: 700, fontSize: 28, color: '#FFF', letterSpacing: -1 }}>TOQUEPLAY</p>
      <p className="mt-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Onde o vôlei acontece</p>
      <div className="absolute bottom-16 flex gap-1.5">
        <div className="size-1.5 rounded-full bg-white/40 animate-pulse" />
        <div className="size-1.5 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="size-1.5 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
