import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '../stores/authStore';
import type { LiveMatch } from '../services/match';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';
const WS_URL = BASE_URL.replace('/api', '');

/**
 * Subscribes to live match WebSocket events and updates the matches array in-place.
 */
export function useLiveMatchesSocket(
  liveMatches: LiveMatch[],
  onUpdate: (updated: LiveMatch[]) => void,
) {
  const socketRef = useRef<Socket | null>(null);
  const matchesRef = useRef(liveMatches);
  matchesRef.current = liveMatches;

  useEffect(() => {
    const token = useAuthStore.getState().accessToken;
    if (!token || liveMatches.length === 0) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      // Join tournament rooms for each live match
      const joined = new Set<string>();
      for (const m of matchesRef.current) {
        const tid = (m as any).tournamentId || (m as any).bracket?.tournamentId || (m as any).bracket?.tournament?.id;
        if (tid && !joined.has(tid)) {
          socket.emit('tournament:join', { tournamentId: tid });
          joined.add(tid);
        }
      }
    });

    const updateMatch = (data: any) => {
      if (!data.matchId) return;
      const updated = matchesRef.current.map((m) => {
        if (m.id !== data.matchId) return m;

        // If match finished, remove it
        if (data.status === 'FINISHED' || data.status === 'WALKOVER') return null;

        return {
          ...m,
          ...(data.scoreTeamA !== undefined ? { scoreTeamA: data.scoreTeamA } : {}),
          ...(data.scoreTeamB !== undefined ? { scoreTeamB: data.scoreTeamB } : {}),
          ...(data.scoreA !== undefined ? { scoreTeamA: data.scoreA } : {}),
          ...(data.scoreB !== undefined ? { scoreTeamB: data.scoreB } : {}),
          ...(data.sets ? { sets: data.sets } : {}),
        };
      }).filter(Boolean) as LiveMatch[];

      onUpdate(updated);
    };

    socket.on('match:point', updateMatch);
    socket.on('match:start', updateMatch);
    socket.on('match:set-finish', updateMatch);
    socket.on('match:finish', (data: any) => {
      // Remove finished match from live list
      if (!data.matchId) return;
      const updated = matchesRef.current.filter((m) => m.id !== data.matchId);
      onUpdate(updated);
    });
    socket.on('match:update', updateMatch);

    return () => {
      socket.off('match:point');
      socket.off('match:start');
      socket.off('match:set-finish');
      socket.off('match:finish');
      socket.off('match:update');
      socket.off('connect');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [liveMatches.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps
}
