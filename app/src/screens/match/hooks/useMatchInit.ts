import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { matchService } from '../../../services/match';
import { tournamentService } from '../../../services/tournament';
import { useLiveMatchStore } from '../../../stores/matchStore';
import { MatchStatus } from '../../../types/match';
import type { Match } from '../../../types/match';

interface Args {
  matchId: string;
  tournamentId?: string;
  userId?: string;
}

export function useMatchInit({ matchId, tournamentId, userId }: Args) {
  const isFriendly = !tournamentId;
  const [initialLoading, setInitialLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTournamentReferee, setIsTournamentReferee] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  const { match, events, isReferee, joinMatch, leaveMatch, setMatch } = useLiveMatchStore();

  const loadTimeline = useCallback(async () => {
    try {
      const timeline = await matchService.getTimeline(matchId);
      setTimelineEvents(timeline);
    } catch {
      setTimelineEvents([]);
    }
  }, [matchId]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          const found = (await matchService.findOne(matchId)) as Match;
          if (found && mounted) {
            setMatch(found);
            const isDone =
              found.status === MatchStatus.FINISHED || found.status === MatchStatus.WALKOVER;
            if (!isDone) {
              joinMatch(found, tournamentId);
            }
            loadTimeline();
          }
          if (!isFriendly && tournamentId) {
            const [tournament, refs] = await Promise.all([
              tournamentService.findOne(tournamentId),
              tournamentService.getReferees(tournamentId).catch(() => []),
            ]);
            if (mounted) {
              setIsOwner(tournament.ownerId === userId);
              setIsTournamentReferee(
                (refs as any[]).some((r: any) => r.userId === userId && r.codeConfirmed),
              );
            }
          }
        } catch {
          // noop
        } finally {
          if (mounted) setInitialLoading(false);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [matchId, tournamentId, isFriendly, userId, loadTimeline, joinMatch, setMatch]),
  );

  useEffect(() => {
    return () => {
      leaveMatch();
    };
  }, [leaveMatch]);

  const reloadMatch = useCallback(async () => {
    try {
      const [found, timeline] = await Promise.all([
        matchService.findOne(matchId) as Promise<Match>,
        matchService.getTimeline(matchId).catch(() => []),
      ]);
      if (found) setMatch(found);
      setTimelineEvents(timeline);
    } catch {
      // noop
    }
  }, [matchId, setMatch]);

  return {
    match,
    events,
    isReferee,
    initialLoading,
    isOwner,
    isTournamentReferee,
    timelineEvents,
    reloadMatch,
  };
}
