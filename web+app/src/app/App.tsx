import { useMemo, useState } from 'react';
import { Trophy, Volleyball, X } from 'lucide-react';
import { BottomNav, TabKey } from './components/BottomNav';
import { Nav, Route } from './router';
import { notifications } from './data/mocks';

import { Splash } from './screens/Splash';
import { Login, Register } from './screens/Auth';
import { Home } from './screens/Home';
import { Explore } from './screens/Explore';
import { Notifications } from './screens/Notifications';
import { Profile } from './screens/Profile';
import { Teams } from './screens/Teams';
import { TeamDetail } from './screens/TeamDetail';
import { MyTournaments } from './screens/MyTournaments';
import { MyRefereeing } from './screens/MyRefereeing';
import { TournamentDetail } from './screens/TournamentDetail';
import { CreateTournament } from './screens/CreateTournament';
import { CreateFriendly } from './screens/CreateFriendly';
import { FriendlyDetail } from './screens/FriendlyDetail';
import { MatchLive } from './screens/MatchLive';
import { RefereeEnter, RefereeCode } from './screens/Referee';
import { TournamentRegister } from './screens/TournamentRegister';
import { AdminApp } from './admin/AdminApp';

const TAB_ROUTES: Route[] = ['home', 'explore', 'notifications', 'profile'];

type Stage = 'splash' | 'auth' | 'app' | 'admin';

export default function App() {
  const [stage, setStage] = useState<Stage>('splash');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [stack, setStack] = useState<{ route: Route; param?: string }[]>([{ route: 'home' }]);
  const [createOpen, setCreateOpen] = useState(false);

  const current = stack[stack.length - 1];

  const nav: Nav = useMemo(
    () => ({
      go: (route, param) => {
        if (route === 'create') {
          setCreateOpen(true);
          return;
        }
        setStack((s) => [...s, { route, param }]);
      },
      back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    }),
    [],
  );

  const goTab = (t: TabKey) => {
    if (t === 'create') {
      setCreateOpen(true);
      return;
    }
    setStack([{ route: t as Route }]);
  };

  const unread = notifications.filter((n) => !n.read).length;

  if (stage === 'splash') {
    return (
      <div className="size-full max-w-[390px] mx-auto min-h-[844px]">
        <Splash onDone={() => setStage('auth')} />
      </div>
    );
  }

  if (stage === 'admin') {
    return <AdminApp onExit={() => setStage('auth')} />;
  }

  if (stage === 'auth') {
    return (
      <div className="size-full max-w-[390px] mx-auto min-h-[844px]">
        {authMode === 'login' ? (
          <Login onAuthed={() => setStage('app')} onSwitch={() => setAuthMode('register')} onAdmin={() => setStage('admin')} />
        ) : (
          <Register onAuthed={() => setStage('app')} onSwitch={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  const screen = renderScreen(current, nav, () => {
    setStack([{ route: 'home' }]);
    setStage('auth');
  });

  const showBottomNav = TAB_ROUTES.includes(current.route);
  const activeTab = (TAB_ROUTES.includes(current.route) ? current.route : 'home') as TabKey;

  return (
    <div className="size-full max-w-[390px] mx-auto min-h-[844px] bg-[#FAFAFA] relative overflow-hidden">
      {screen}
      {showBottomNav && <BottomNav active={activeTab} onChange={goTab} unread={unread} />}
      {createOpen && (
        <CreateSheet
          onClose={() => setCreateOpen(false)}
          onTournament={() => {
            setCreateOpen(false);
            nav.go('create-tournament');
          }}
          onFriendly={() => {
            setCreateOpen(false);
            nav.go('create-friendly');
          }}
        />
      )}
    </div>
  );
}

function renderScreen(current: { route: Route; param?: string }, nav: Nav, onLogout: () => void) {
  switch (current.route) {
    case 'home':
      return <Home nav={nav} />;
    case 'explore':
      return <Explore nav={nav} />;
    case 'notifications':
      return <Notifications nav={nav} />;
    case 'profile':
      return <Profile nav={nav} onLogout={onLogout} />;
    case 'teams':
      return <Teams nav={nav} />;
    case 'team-detail':
      return <TeamDetail id={current.param} nav={nav} />;
    case 'my-tournaments':
      return <MyTournaments nav={nav} />;
    case 'my-refereeing':
      return <MyRefereeing nav={nav} />;
    case 'tournament':
      return <TournamentDetail id={current.param} nav={nav} />;
    case 'create-tournament':
      return <CreateTournament nav={nav} />;
    case 'create-friendly':
      return <CreateFriendly nav={nav} />;
    case 'friendly':
      return <FriendlyDetail id={current.param} nav={nav} />;
    case 'match':
      return <MatchLive id={current.param} nav={nav} />;
    case 'referee-enter':
      return <RefereeEnter nav={nav} />;
    case 'referee-code':
      return <RefereeCode nav={nav} />;
    case 'tournament-register':
      return <TournamentRegister id={current.param} nav={nav} />;
    default:
      return <Home nav={nav} />;
  }
}

function CreateSheet({ onClose, onTournament, onFriendly }: { onClose: () => void; onTournament: () => void; onFriendly: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-[#150A1F]/60 backdrop-blur-sm" />
      <div className="relative w-full bg-white rounded-t-3xl p-5 pb-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#150A1F', letterSpacing: 0.5 }}>CRIAR</p>
          <button onClick={onClose} className="size-9 rounded-full bg-[#F4EFFA] flex items-center justify-center"><X size={18} color="#6D2EC0" /></button>
        </div>
        <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>O que vamos organizar agora?</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={onTournament} className="bg-gradient-to-br from-[#6D2EC0] to-[#4A1F87] rounded-2xl p-5 text-left text-white">
            <Trophy size={28} />
            <p className="mt-3" style={{ fontFamily: 'Bebas Neue', fontSize: 18, letterSpacing: 0.5 }}>TORNEIO</p>
            <p style={{ fontFamily: 'Manrope', fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Crie um circuito ou copa</p>
          </button>
          <button onClick={onFriendly} className="bg-[#F4EFFA] rounded-2xl p-5 text-left">
            <Volleyball size={28} color="#6D2EC0" />
            <p className="mt-3" style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#6D2EC0', letterSpacing: 0.5 }}>AMISTOSO</p>
            <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>Desafie outro time</p>
          </button>
        </div>
      </div>
    </div>
  );
}
