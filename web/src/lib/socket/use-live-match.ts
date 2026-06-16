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

const EVENTS = ["match:start", "match:point", "match:set-finish", "match:finish"] as const;

/** Junctiona room `match:<id>` e invalida query ao receber qualquer evento. */
export function useLiveMatch(matchId: string | null) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!matchId) return;
    const s = getSocket();

    function join() {
      s.emit("match:join", { matchId });
    }
    function onEvent() {
      qc.invalidateQueries({ queryKey: ["admin", "match", matchId] });
    }

    if (s.connected) join();
    s.on("connect", join);
    for (const ev of EVENTS) s.on(ev, onEvent);

    return () => {
      s.off("connect", join);
      for (const ev of EVENTS) s.off(ev, onEvent);
      s.emit("match:leave", { matchId });
    };
  }, [matchId, qc]);
}
