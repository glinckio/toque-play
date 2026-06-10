import { Calendar, MapPin, Trophy, Users, Volleyball } from 'lucide-react';
import { Friendly, Match, Team, Tournament } from '../data/types';
import { StatusBadge } from './StatusBadge';

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtShortDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export function TournamentCard({ tournament, onClick }: { tournament: Tournament; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="block w-full text-left bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(20,10,30,0.06)] active:scale-[0.99] transition-transform">
      <div className="relative h-32" style={{ background: tournament.coverUrl ? `url(${tournament.coverUrl}) center/cover` : 'linear-gradient(135deg,#6D2EC0,#A674F0)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(20,10,30,0) 40%, rgba(20,10,30,0.7))' }} />
        <div className="absolute top-3 left-3"><StatusBadge status={tournament.status} /></div>
        <div className="absolute bottom-3 left-3 right-3">
          <p style={{ fontFamily: 'Bebas Neue', fontSize: 22, lineHeight: 1, color: '#FFF', letterSpacing: 0.3 }}>{tournament.name}</p>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#6B5B7E]" style={{ fontFamily: 'Manrope', fontSize: 12 }}>
          <span className="inline-flex items-center gap-1"><Calendar size={13} />{fmtShortDate(tournament.startDate)}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={13} />{tournament.city}/{tournament.state}</span>
        </div>
        <span className="inline-flex items-center gap-1" style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 12, color: '#6D2EC0' }}>
          <Users size={13} />{tournament.participantsCount}
        </span>
      </div>
    </button>
  );
}

export function FriendlyCard({ friendly, onClick }: { friendly: Friendly; onClick?: () => void }) {
  const a = friendly.requesterTeam?.name ?? friendly.requester.name;
  const b = friendly.challengedTeam?.name ?? friendly.challenged?.name ?? 'Aguardando';
  return (
    <button onClick={onClick} className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(20,10,30,0.06)] active:scale-[0.99] transition-transform">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#F4EFFA]">
        <StatusBadge status={friendly.status} />
        <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 11, color: '#6B5B7E' }}>
          {friendly.modality === 'BEACH' ? 'Praia' : 'Quadra'} · {friendly.categoryFormat}
        </span>
      </div>
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }} className="truncate">{a}</p>
          <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#A89BBA' }}>Solicitante</p>
        </div>
        <div className="px-3" style={{ fontFamily: 'Bebas Neue', fontSize: 16, color: '#6D2EC0' }}>VS</div>
        <div className="flex-1 min-w-0 text-right">
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: '#150A1F' }} className="truncate">{b}</p>
          <p style={{ fontFamily: 'Manrope', fontSize: 11, color: '#A89BBA' }}>Desafiado</p>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-[#FAFAFA] flex items-center justify-between" style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>
        <span className="inline-flex items-center gap-1"><Calendar size={12} />{fmtDate(friendly.date)} · {friendly.startTime}</span>
        <span className="inline-flex items-center gap-1"><MapPin size={12} />{friendly.city}</span>
      </div>
    </button>
  );
}

export function MatchCard({ match, onClick }: { match: Match; onClick?: () => void }) {
  const setsA = match.sets.filter((s) => s.scoreA > s.scoreB && s.finished).length;
  const setsB = match.sets.filter((s) => s.scoreB > s.scoreA && s.finished).length;
  return (
    <button onClick={onClick} className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(20,10,30,0.06)]">
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: 'linear-gradient(90deg,#6D2EC0,#4A1F87)' }}>
        <div className="flex items-center gap-2">
          <Trophy size={13} color="#FFF" />
          <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 11, color: '#FFF' }}>
            {match.tournamentName ?? 'Amistoso'}
          </span>
        </div>
        {match.label && <span style={{ fontFamily: 'Bebas Neue', fontSize: 12, color: '#FFF', letterSpacing: 0.5 }}>{match.label}</span>}
      </div>
      <div className="px-4 py-4 flex items-center">
        <div className="flex-1 text-center">
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{match.teamA.name}</p>
        </div>
        <div className="px-4 flex items-baseline gap-2">
          <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#6D2EC0', lineHeight: 1 }}>{setsA}</span>
          <span style={{ fontFamily: 'Manrope', fontSize: 14, color: '#A89BBA' }}>—</span>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: 32, color: '#150A1F', lineHeight: 1 }}>{setsB}</span>
        </div>
        <div className="flex-1 text-center">
          <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: '#150A1F' }}>{match.teamB.name}</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-[#FAFAFA] flex items-center justify-between">
        <StatusBadge status={match.status} size="sm" />
        <span style={{ fontFamily: 'Manrope', fontSize: 11, color: '#6B5B7E' }}>{fmtShortDate(match.scheduledAt)}</span>
      </div>
    </button>
  );
}

export function TeamCard({ team, onClick }: { team: Team; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_2px_12px_rgba(20,10,30,0.06)] active:scale-[0.99] transition-transform">
      <div className="size-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6D2EC0,#A674F0)' }}>
        <Volleyball size={24} color="#FFF" />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: '#150A1F' }}>{team.name}</p>
        <p style={{ fontFamily: 'Manrope', fontSize: 12, color: '#6B5B7E' }}>
          {team.modality === 'BEACH' ? 'Praia' : 'Quadra'} · {team.members.length} atletas
        </p>
      </div>
      <div className="text-right">
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 18, color: '#1FB87A', lineHeight: 1 }}>{team.wins}<span style={{ fontSize: 12, color: '#A89BBA' }}>V</span></p>
        <p style={{ fontFamily: 'Bebas Neue', fontSize: 14, color: '#E04545', lineHeight: 1 }}>{team.losses}<span style={{ fontSize: 10, color: '#A89BBA' }}>D</span></p>
      </div>
    </button>
  );
}
