import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from './authStore';
import { Match, MatchStatus } from '../types/match';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';
const WS_URL = BASE_URL.replace('/api', '');

export interface MatchEvent {
  type: string;
  team?: string;
  scoreA?: number;
  scoreB?: number;
  setNumber?: number;
  winnerId?: string;
  timestamp: string;
}

interface LiveMatchState {
  match: Match | null;
  events: MatchEvent[];
  isReferee: boolean;
  socket: Socket | null;

  joinMatch: (match: Match, tournamentId?: string) => void;
  leaveMatch: () => void;
  setMatch: (match: Match) => void;
}

export const useLiveMatchStore = create<LiveMatchState>((set, get) => ({
  match: null,
  events: [],
  isReferee: false,
  socket: null,

  joinMatch: (match, tournamentId) => {
    // Disconnect previous socket
    const prev = get().socket;
    if (prev) {
      prev.removeAllListeners();
      prev.disconnect();
    }

    const token = useAuthStore.getState().accessToken;
    const userId = useAuthStore.getState().user?.id;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5,
      timeout: 20000,
    });

    socket.on('connect', () => {
      if (__DEV__) console.log('[WS] Connected, joining match:', match.id);
      socket.emit('match:join', { matchId: match.id });
    });

    socket.on('connect_error', (err) => {
      if (__DEV__) console.warn('[WS] Connect error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      if (__DEV__) console.log('[WS] Disconnected:', reason);
    });

    const updateMatch = (data: any) => {
      if (data.matchId && data.matchId !== match.id) return;
      const current = get().match;
      if (!current) return;

      const updated = {
        ...current,
        ...(data.scoreTeamA !== undefined ? { scoreTeamA: data.scoreTeamA } : {}),
        ...(data.scoreTeamB !== undefined ? { scoreTeamB: data.scoreTeamB } : {}),
        ...(data.scoreA !== undefined ? { scoreTeamA: data.scoreA } : {}),
        ...(data.scoreB !== undefined ? { scoreTeamB: data.scoreB } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.winnerId !== undefined ? { winnerId: data.winnerId } : {}),
        ...(data.sets ? { sets: data.sets } : {}),
      };

      set({ match: updated });
    };

    socket.on('match:point', (data: any) => {
      updateMatch(data);
      set((s) => {
        const currentSetNum = s.match?.sets?.[s.match.sets.length - 1]?.setNumber ?? 1;
        return {
          events: [
            {
              type: data.sideSwitch ? 'SIDE_SWITCH' : 'POINT',
              team: data.team,
              scoreA: data.scoreA ?? data.scoreTeamA ?? s.match?.scoreTeamA ?? 0,
              scoreB: data.scoreB ?? data.scoreTeamB ?? s.match?.scoreTeamB ?? 0,
              sideSwitch: data.sideSwitch ?? false,
              setNumber: currentSetNum,
              timestamp: new Date().toISOString(),
            },
            ...s.events,
          ],
        };
      });
    });

    socket.on('match:start', (data: any) => {
      updateMatch(data);
      set((s) => ({
        events: [
          { type: 'MATCH_START', timestamp: new Date().toISOString() },
          ...s.events,
        ],
      }));
    });

    socket.on('match:finish', (data: any) => {
      updateMatch(data);
      set((s) => ({
        events: [
          {
            type: 'MATCH_FINISH',
            winnerId: data.winnerId,
            timestamp: new Date().toISOString(),
          },
          ...s.events,
        ],
      }));
    });

    socket.on('match:set-finish', (data: any) => {
      updateMatch(data);
      set((s) => ({
        events: [
          {
            type: 'SET_FINISH',
            setNumber: data.setNumber,
            scoreA: data.scoreA ?? 0,
            scoreB: data.scoreB ?? 0,
            timestamp: new Date().toISOString(),
          },
          ...s.events,
        ],
      }));
    });

    socket.on('match:update', (data: any) => {
      updateMatch(data);
    });

    set({
      match,
      socket,
      isReferee: !!(userId && (match.refereeId === userId)),
      events: [],
    });
  },

  leaveMatch: () => {
    const socket = get().socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ match: null, socket: null, events: [], isReferee: false });
  },

  setMatch: (match) => set({ match }),
}));
