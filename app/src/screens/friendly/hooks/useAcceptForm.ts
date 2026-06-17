import { useCallback, useEffect, useState } from 'react';
import { teamService } from '../../../services/team';
import type { Friendly } from '../../../types/friendly';
import { getCategoryMax } from '../constants';

export function useAcceptForm(friendly: Friendly | null, enabled: boolean) {
  const [acceptMembers, setAcceptMembers] = useState<any[]>([]);
  const [acceptAthletes, setAcceptAthletes] = useState<Set<string>>(new Set());
  const [acceptCaptainId, setAcceptCaptainId] = useState<string | null>(null);
  const [loadingAcceptMembers, setLoadingAcceptMembers] = useState(false);

  const challengedTeamId = friendly?.challengedTeamId;

  useEffect(() => {
    if (!enabled || !challengedTeamId) return;
    setLoadingAcceptMembers(true);
    teamService
      .findOne(challengedTeamId)
      .then((team) => setAcceptMembers(team.members ?? []))
      .catch(() => setAcceptMembers([]))
      .finally(() => setLoadingAcceptMembers(false));
  }, [enabled, challengedTeamId]);

  const toggleAcceptAthlete = useCallback(
    (memberId: string) => {
      const max = getCategoryMax(friendly?.categoryFormat);
      setAcceptAthletes((prev) => {
        const next = new Set(prev);
        if (next.has(memberId)) {
          next.delete(memberId);
          setAcceptCaptainId((cur) => (cur === memberId ? null : cur));
        } else {
          if (max > 0 && next.size >= max) return prev;
          next.add(memberId);
        }
        return next;
      });
    },
    [friendly?.categoryFormat],
  );

  const reset = useCallback(() => {
    setAcceptAthletes(new Set());
    setAcceptCaptainId(null);
  }, []);

  return {
    acceptMembers,
    acceptAthletes,
    acceptCaptainId,
    setAcceptCaptainId,
    loadingAcceptMembers,
    toggleAcceptAthlete,
    reset,
  };
}
