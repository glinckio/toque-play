import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../stores/authStore';
import { useLiveMatchStore } from '../../../stores/matchStore';
import { useDialogStore } from '../../../stores/dialogStore';
import { friendlyService } from '../../../services/friendly';
import { FriendlyStatus } from '../../../types/friendly';
import type { Friendly } from '../../../types/friendly';

export function useFriendlyDetail(friendlyId: string) {
  const user = useAuthStore((s) => s.user);
  const rootNav = useNavigation<any>();
  const dialog = useDialogStore();

  const [friendly, setFriendly] = useState<Friendly | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadFriendly = useCallback(() => {
    setLoading(true);
    friendlyService
      .findOne(friendlyId)
      .then(setFriendly)
      .catch(() => setFriendly(null))
      .finally(() => setLoading(false));
  }, [friendlyId]);

  useFocusEffect(
    useCallback(() => {
      loadFriendly();
    }, [loadFriendly]),
  );

  const { match: liveMatchData, joinMatch, leaveMatch } = useLiveMatchStore();

  useEffect(() => {
    if (friendly?.match?.id && friendly.match.status === 'IN_PROGRESS') {
      joinMatch(friendly.match as any);
    }
    return () => {
      leaveMatch();
    };
  }, [friendly?.match?.id, friendly?.match?.status, joinMatch, leaveMatch]);

  const displayFriendly = useMemo(() => {
    if (!friendly || !liveMatchData || friendly.match?.id !== liveMatchData.id) {
      return friendly;
    }
    return {
      ...friendly,
      match: {
        ...friendly.match,
        scoreTeamA: liveMatchData.scoreTeamA,
        scoreTeamB: liveMatchData.scoreTeamB,
        sets: liveMatchData.sets,
        status: liveMatchData.status,
      },
    } as Friendly;
  }, [friendly, liveMatchData]);

  const handleAccept = useCallback(
    async (athletes: string[], captainId: string | null, max: number) => {
      if (!displayFriendly) return;
      if (max > 0 && athletes.length !== max) {
        dialog.warning(`Selecione exatamente ${max} jogador${max > 1 ? 'es' : ''}.`);
        return false;
      }
      setActionLoading(true);
      try {
        await friendlyService.accept(
          displayFriendly.id,
          athletes,
          captainId ?? undefined,
        );
        loadFriendly();
        return true;
      } catch (e: any) {
        const msg = e?.response?.data?.message || 'Não foi possível aceitar.';
        dialog.error(typeof msg === 'string' ? msg : 'Não foi possível aceitar.');
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [dialog, displayFriendly, loadFriendly],
  );

  const handleRejectOrCancel = useCallback(
    async (action: 'reject' | 'cancel') => {
      if (!displayFriendly) return;
      setActionLoading(true);
      try {
        await friendlyService[action](displayFriendly.id);
        rootNav.goBack();
      } catch (e: any) {
        const msg = e?.response?.data?.message || 'Não foi possível realizar a ação.';
        dialog.error(typeof msg === 'string' ? msg : 'Não foi possível realizar a ação.');
      } finally {
        setActionLoading(false);
      }
    },
    [dialog, displayFriendly, rootNav],
  );

  const handleGenerateCode = useCallback(async () => {
    if (!displayFriendly) return;
    setActionLoading(true);
    try {
      await friendlyService.generateRefereeCode(displayFriendly.id);
      loadFriendly();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível gerar o código.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível gerar o código.');
    } finally {
      setActionLoading(false);
    }
  }, [dialog, displayFriendly, loadFriendly]);

  const isChallenged = displayFriendly?.challengedId === user?.id;
  const isRequester = displayFriendly?.requesterId === user?.id;
  const canRespond = isChallenged && displayFriendly?.status === FriendlyStatus.PENDING;
  const canCancel =
    isRequester &&
    (displayFriendly?.status === FriendlyStatus.PENDING ||
      displayFriendly?.status === FriendlyStatus.ACCEPTED);
  const isLive =
    displayFriendly?.status === FriendlyStatus.ACCEPTED &&
    displayFriendly?.match?.status === 'IN_PROGRESS';
  const isTeamMember =
    !!(user && displayFriendly?.athletes?.some((a) => a.teamMember?.user?.id === user.id)) ||
    isRequester ||
    isChallenged;
  const canWatchLive = !!(
    isLive &&
    displayFriendly?.match?.id &&
    (isTeamMember || isRequester || isChallenged)
  );

  return {
    user,
    rootNav,
    displayFriendly,
    loading,
    actionLoading,
    isChallenged,
    isRequester,
    canRespond,
    canCancel,
    isLive,
    canWatchLive,
    handleAccept,
    handleRejectOrCancel,
    handleGenerateCode,
  };
}
