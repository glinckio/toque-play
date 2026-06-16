"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket() {
  if (socket) return socket;
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "http://127.0.0.1:3000";
  socket = io(apiBase, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1500,
  });
  return socket;
}

const MATCH_EVENTS = ["match:start", "match:point", "match:set-finish", "match:finish"] as const;

/**
 * Conecta ao gateway e junctiona rooms de torneio. Quando qualquer evento
 * de partida chega, invalida a query de matches pra refetch.
 */
export function useLiveMatches(tournamentIds: string[]) {
  const qc = useQueryClient();

  useEffect(() => {
    if (tournamentIds.length === 0) return;
    const s = getSocket();

    function joinAll() {
      for (const id of tournamentIds) {
        s.emit("tournament:join", { tournamentId: id });
      }
    }

    function onEvent() {
      qc.invalidateQueries({ queryKey: ["admin", "matches"] });
    }

    if (s.connected) joinAll();
    s.on("connect", joinAll);
    for (const ev of MATCH_EVENTS) s.on(ev, onEvent);

    return () => {
      s.off("connect", joinAll);
      for (const ev of MATCH_EVENTS) s.off(ev, onEvent);
      for (const id of tournamentIds) {
        s.emit("tournament:leave", { tournamentId: id });
      }
    };
  }, [tournamentIds.join("|"), qc]);
}
