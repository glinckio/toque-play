import { useState } from 'react';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { HeroHeader } from '../components/HeroHeader';
import { Input } from '../components/Input';
import { ChevronButton } from '../components/ChevronButton';
import { StatusBar } from '../components/StatusBar';

interface AuthProps {
  onAuthed: () => void;
  onSwitch: () => void;
  onAdmin?: () => void;
}

export function Login({ onAuthed, onSwitch, onAdmin }: AuthProps) {
  const [email, setEmail] = useState('lucas@toqueplay.app');
  const [password, setPassword] = useState('••••••••');
  return (
    <div className="min-h-full bg-[#FAFAFA] flex flex-col">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader title="BEM-VINDO DE VOLTA" subtitle="Entre para acompanhar seus torneios e amistosos" watermark="ENTRAR" rounded />
      <div className="px-5 pt-6 pb-32 flex-1">
        <div className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} placeholder="seu@email.com" />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={16} />} placeholder="••••••••" />
          <button className="block" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: '#6D2EC0' }}>Esqueci minha senha</button>
        </div>
        <div className="mt-8 space-y-3">
          <ChevronButton variant="primary" size="lg" fullWidth onClick={onAuthed}>Entrar</ChevronButton>
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-[#ECECF0]" />
            <span style={{ fontFamily: 'Manrope', fontSize: 11, color: '#A89BBA' }}>OU</span>
            <div className="flex-1 h-px bg-[#ECECF0]" />
          </div>
          <button onClick={onAuthed} className="w-full h-12 flex items-center justify-center gap-2 bg-white border border-[#ECECF0] rounded-md active:bg-[#F4EFFA]">
            <GoogleIcon />
            <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 14, color: '#150A1F' }}>Continuar com Google</span>
          </button>
          <button onClick={onAuthed} className="w-full h-12 flex items-center justify-center" style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#6D2EC0', letterSpacing: 0.5 }}>
            Entrar como visitante
          </button>
        </div>
        <div className="mt-6 text-center">
          <span style={{ fontFamily: 'Manrope', fontSize: 13, color: '#6B5B7E' }}>Não tem conta? </span>
          <button onClick={onSwitch} style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#6D2EC0' }}>Criar conta</button>
        </div>
        {onAdmin && (
          <div className="mt-4 text-center">
            <button onClick={onAdmin} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFFA]" style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: '#6D2EC0', letterSpacing: 0.3 }}>
              Acesso administrativo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function Register({ onAuthed, onSwitch }: AuthProps) {
  const [name, setName] = useState('Lucas Andrade');
  return (
    <div className="min-h-full bg-[#FAFAFA] flex flex-col">
      <div style={{ background: 'linear-gradient(135deg,#6D2EC0,#4A1F87)' }}>
        <StatusBar color="#FFFFFF" />
      </div>
      <HeroHeader title="CRIE SUA CONTA" subtitle="Monte seu time e participe de torneios" watermark="CRIAR" rounded />
      <div className="px-5 pt-6 pb-32 flex-1">
        <div className="space-y-4">
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} icon={<UserIcon size={16} />} placeholder="Seu nome" />
          <Input label="Email" type="email" icon={<Mail size={16} />} placeholder="seu@email.com" />
          <Input label="Senha" type="password" icon={<Lock size={16} />} placeholder="Mínimo 8 caracteres" />
          <Input label="Confirmar senha" type="password" icon={<Lock size={16} />} placeholder="Repita a senha" />
          <label className="flex items-start gap-2 pt-1">
            <input type="checkbox" className="mt-0.5 accent-[#6D2EC0]" defaultChecked />
            <span style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>
              Aceito os <span style={{ color: '#6D2EC0', fontWeight: 600 }}>Termos de Uso</span> e a <span style={{ color: '#6D2EC0', fontWeight: 600 }}>Política de Privacidade</span>
            </span>
          </label>
        </div>
        <div className="mt-7">
          <ChevronButton variant="primary" size="lg" fullWidth onClick={onAuthed}>Criar conta</ChevronButton>
        </div>
        <div className="mt-6 text-center">
          <span style={{ fontFamily: 'Manrope', fontSize: 13, color: '#6B5B7E' }}>Já tem conta? </span>
          <button onClick={onSwitch} style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#6D2EC0' }}>Entrar</button>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.56 2.68-3.87 2.68-6.61z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.32z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}
