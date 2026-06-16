/**
 * WebSocket event payloads emitted by the backend MatchesGateway.
 * Mirrors what `matches.service.emitMatchEvent` sends.
 */

export interface WsMatchUpdateBase {
  matchId?: string;
}

export interface WsMatchScoreUpdate extends WsMatchUpdateBase {
  scoreTeamA?: number;
  scoreTeamB?: number;
  scoreA?: number;
  scoreB?: number;
  status?: string;
  winnerId?: string | null;
  sets?: Array<{ setNumber: number; scoreA: number; scoreB: number }>;
}

export interface WsMatchPoint extends WsScoreFields {
  matchId?: string;
  team?: string;
  sideSwitch?: boolean;
  setNumber?: number;
  timestamp?: string;
}

export interface WsMatchStart extends WsMatchUpdateBase {
  startedAt?: string;
}

export interface WsMatchFinish extends WsMatchUpdateBase {
  winnerId?: string | null;
  finishedAt?: string;
}

export interface WsMatchSetFinish extends WsMatchUpdateBase {
  setNumber: number;
  scoreA?: number;
  scoreB?: number;
}

interface WsScoreFields {
  scoreA?: number;
  scoreB?: number;
  scoreTeamA?: number;
  scoreTeamB?: number;
}

export type WsMatchEvent =
  | WsMatchScoreUpdate
  | WsMatchPoint
  | WsMatchStart
  | WsMatchFinish
  | WsMatchSetFinish;
