import { useState } from 'react';
import { matchService } from '../../../services/match';
import { useDialogStore } from '../../../stores/dialogStore';
import type { Match } from '../../../types/match';

interface Args {
  matchId: string;
  reloadMatch: () => Promise<void>;
}

export function useMatchActions({ matchId, reloadMatch }: Args) {
  const dialog = useDialogStore();
  const [actionLoading, setActionLoading] = useState(false);

  const run = async (
    fn: () => Promise<any>,
    errorFallback: string,
  ): Promise<boolean> => {
    if (actionLoading) return false;
    setActionLoading(true);
    try {
      await fn();
      await reloadMatch();
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? errorFallback;
      dialog.error(typeof msg === 'string' ? msg : errorFallback);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleStart = () =>
    run(() => matchService.startMatch(matchId), 'Não foi possível iniciar.');

  const handlePoint = (team: 'A' | 'B') =>
    run(() => matchService.registerPoint(matchId, team), 'Erro ao marcar ponto.');

  const handleRemovePoint = (team: 'A' | 'B') =>
    run(() => matchService.removePoint(matchId, team), 'Erro ao remover ponto.');

  const handleFinishSet = (currentSet?: Match['sets'][number]) => {
    if (!currentSet) return Promise.resolve();
    return run(
      () => matchService.finishSet(matchId, currentSet.setNumber),
      'Erro ao finalizar set.',
    );
  };

  const handleFinish = () => {
    dialog.confirm({
      title: 'Finalizar partida?',
      message: 'Tem certeza que deseja encerrar?',
      confirmText: 'Finalizar',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await matchService.finishMatch(matchId);
          await reloadMatch();
        } catch (e: any) {
          const raw = e?.response?.data?.message;
          const code = e?.response?.data?.code;
          const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
          const msg = isGeneric ? code ?? 'Erro ao finalizar' : raw;
          dialog.error(typeof msg === 'string' ? msg : 'Erro ao finalizar');
        }
      },
    });
  };

  const handleWalkover = (
    winnerTeam: 'A' | 'B',
    teamAName: string,
    teamBName: string,
  ) => {
    const teamName = winnerTeam === 'A' ? teamAName : teamBName;
    dialog.confirm({
      title: 'Declarar W.O.?',
      message: `${teamName} vence por W.O.?`,
      confirmText: 'Confirmar W.O.',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await matchService.declareWalkover(matchId, winnerTeam);
          await reloadMatch();
        } catch (e: any) {
          const raw = e?.response?.data?.message;
          const code = e?.response?.data?.code;
          const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
          const msg = isGeneric ? code ?? 'Erro ao declarar W.O.' : raw;
          dialog.error(typeof msg === 'string' ? msg : 'Erro ao declarar W.O.');
        }
      },
    });
  };

  return {
    actionLoading,
    handleStart,
    handlePoint,
    handleRemovePoint,
    handleFinishSet,
    handleFinish,
    handleWalkover,
  };
}
