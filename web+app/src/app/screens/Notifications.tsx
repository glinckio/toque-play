import { Bell, Check, Trophy, UserPlus, Volleyball, X } from 'lucide-react';
import { notifications } from '../data/mocks';
import { AppNotification, NotificationType } from '../data/types';
import { StatusBar } from '../components/StatusBar';
import { ChevronButton } from '../components/ChevronButton';
import { Nav } from '../router';

const iconFor: Record<NotificationType, any> = {
  FRIENDLY_REQUEST: <Volleyball size={18} color="#FFF" />,
  FRIENDLY_ACCEPTED: <Check size={18} color="#FFF" />,
  TOURNAMENT_UPDATE: <Trophy size={18} color="#FFF" />,
  MATCH_REMINDER: <Bell size={18} color="#FFF" />,
  REFEREE_ASSIGNED: <UserPlus size={18} color="#FFF" />,
};

const bgFor: Record<NotificationType, string> = {
  FRIENDLY_REQUEST: 'linear-gradient(135deg,#6D2EC0,#A674F0)',
  FRIENDLY_ACCEPTED: 'linear-gradient(135deg,#1FB87A,#2DD89B)',
  TOURNAMENT_UPDATE: 'linear-gradient(135deg,#4A1F87,#6D2EC0)',
  MATCH_REMINDER: 'linear-gradient(135deg,#F0A030,#F6C168)',
  REFEREE_ASSIGNED: 'linear-gradient(135deg,#150A1F,#3D2C52)',
};

function groupByDay(list: AppNotification[]) {
  const groups: Record<string, AppNotification[]> = {};
  for (const n of list) {
    const d = new Date(n.createdAt);
    const key = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    groups[key] = groups[key] ?? [];
    groups[key].push(n);
  }
  return groups;
}

export function Notifications({ nav }: { nav: Nav }) {
  const groups = groupByDay(notifications);
  return (
    <div className="min-h-full bg-[#FAFAFA]">
      <StatusBar />
      <div className="px-5 pt-2 pb-4 flex items-center justify-between">
        <div>
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 30, color: '#150A1F', letterSpacing: 0.3, lineHeight: 1 }}>NOTIFICAÇÕES</p>
          <p className="mt-1" style={{ fontFamily: 'Manrope', fontSize: 13, color: '#6B5B7E' }}>{notifications.filter((n) => !n.read).length} não lidas</p>
        </div>
        <button style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: '#6D2EC0' }}>Marcar todas</button>
      </div>

      <div className="px-5 pb-32 space-y-5">
        {Object.entries(groups).map(([day, items]) => (
          <div key={day}>
            <p className="mb-2 capitalize" style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 11, color: '#A89BBA', letterSpacing: 0.5 }}>{day}</p>
            <div className="space-y-2">
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (n.type === 'FRIENDLY_REQUEST' || n.type === 'FRIENDLY_ACCEPTED') nav.go('friendly', n.targetId);
                    else if (n.type === 'TOURNAMENT_UPDATE') nav.go('tournament', n.targetId);
                    else if (n.type === 'MATCH_REMINDER' || n.type === 'REFEREE_ASSIGNED') nav.go('match', n.targetId);
                  }}
                  className={`w-full text-left bg-white rounded-2xl p-3.5 flex items-start gap-3 ${!n.read ? 'ring-1 ring-[#F4EFFA]' : ''}`}
                >
                  <div className="size-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bgFor[n.type] }}>
                    {iconFor[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{n.title}</p>
                      {!n.read && <span className="mt-1.5 size-2 rounded-full bg-[#6D2EC0] flex-shrink-0" />}
                    </div>
                    <p className="mt-0.5" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E', lineHeight: 1.4 }}>{n.body}</p>
                    {n.type === 'FRIENDLY_REQUEST' && (
                      <div className="mt-2.5 flex gap-2">
                        <ChevronButton variant="success" size="sm">Aceitar</ChevronButton>
                        <ChevronButton variant="ghost" size="sm">Recusar</ChevronButton>
                      </div>
                    )}
                    <p className="mt-1.5" style={{ fontFamily: 'Manrope', fontSize: 10, color: '#A89BBA' }}>
                      {new Date(n.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
