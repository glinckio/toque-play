import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useAuthStore } from '../stores/authStore';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';
const WS_URL = BASE_URL.replace('/api', '');

export function useTournamentSocket(
  tournamentId: string | undefined,
  onUpdate: () => void,
) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!tournamentId) return;
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    const socket: Socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('tournament:join', { tournamentId });
    });

    const events = ['match:start', 'match:point', 'match:finish', 'match:set-finish', 'match:update'];
    events.forEach((event) => {
      socket.on(event, () => {
        onUpdateRef.current();
      });
    });

    return () => {
      events.forEach((event) => socket.off(event));
      socket.off('connect');
      socket.disconnect();
    };
  }, [tournamentId]);
}
