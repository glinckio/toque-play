import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { matchService } from '../../services/match';
import { useLiveMatchStore } from '../../stores/matchStore';
import { useAuthStore } from '../../stores/authStore';
import { Match, MatchStatus } from '../../types/match';
import TeamAvatar from '../../components/TeamAvatar';
import type { TournamentStackParamList, FriendlyStackParamList } from '../../navigation/types';
import { tournamentService } from '../../services/tournament';

type TournamentNav = NativeStackNavigationProp<TournamentStackParamList, 'LiveMatch'>;
type FriendlyNav = NativeStackNavigationProp<FriendlyStackParamList, 'LiveMatch'>;
type Nav = TournamentNav | FriendlyNav;

type TournamentRoute = RouteProp<TournamentStackParamList, 'LiveMatch'>;
type FriendlyRoute = RouteProp<FriendlyStackParamList, 'LiveMatch'>;
type Route = TournamentRoute | FriendlyRoute;

export default function LiveMatchScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const params = route.params as any;
  const matchId = params.matchId as string;
  const tournamentId = (params as any).tournamentId as string | undefined;
  const isFriendly = !tournamentId;
  const userId = useAuthStore((s) => s.user?.id);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isTournamentReferee, setIsTournamentReferee] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  const { match, events, isReferee, joinMatch, leaveMatch, setMatch } = useLiveMatchStore();

  // Always fetch full timeline from API
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
          if (isFriendly) {
            // Friendly: load match directly
            const found = await matchService.findOne(matchId) as Match;
            if (found && mounted) {
              setMatch(found);
              const isDone = found.status === MatchStatus.FINISHED || found.status === MatchStatus.WALKOVER;
              if (!isDone) {
                joinMatch(found);
              }
              loadTimeline();
            }
          } else {
            // Tournament: load match directly
            const found = await matchService.findOne(matchId) as Match;

            if (found && mounted) {
              setMatch(found);

              const isDone = found.status === MatchStatus.FINISHED || found.status === MatchStatus.WALKOVER;
              if (!isDone) {
                joinMatch(found, tournamentId);
              }
              loadTimeline();
            }

            // Check if owner + referee (tournament only)
            const [tournament, refs] = await Promise.all([
              tournamentService.findOne(tournamentId!),
              tournamentService.getReferees(tournamentId!).catch(() => []),
            ]);
            if (mounted) {
              setIsOwner(tournament.ownerId === userId);
              setIsTournamentReferee((refs as any[]).some((r: any) => r.userId === userId && r.codeConfirmed));
            }
          }
        } catch {
        } finally {
          if (mounted) setInitialLoading(false);
        }
      })();
      return () => { mounted = false; };
    }, [matchId, tournamentId]),
  );

  useEffect(() => {
    return () => { leaveMatch(); };
  }, []);

  const reloadMatch = useCallback(async () => {
    try {
      const [found, timeline] = await Promise.all([
        matchService.findOne(matchId) as Promise<Match>,
        matchService.getTimeline(matchId).catch(() => []),
      ]);
      if (found) setMatch(found);
      setTimelineEvents(timeline);
    } catch {}
  }, [matchId, setMatch]);

  const handleStart = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await matchService.startMatch(matchId);
      await reloadMatch();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Não foi possível iniciar.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível iniciar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePoint = async (team: 'A' | 'B') => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await matchService.registerPoint(matchId, team);
      // Socket updates the score in real-time; reload only as fallback
      await reloadMatch();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Erro ao marcar ponto.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao marcar ponto.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemovePoint = async (team: 'A' | 'B') => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await matchService.removePoint(matchId, team);
      await reloadMatch();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Erro ao remover ponto.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao remover ponto.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinishSet = async () => {
    if (!match) return;
    const currentSet = match.sets?.[match.sets.length - 1];
    if (!currentSet) return;
    try {
      await matchService.finishSet(matchId, currentSet.setNumber);
      await reloadMatch();
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Erro ao finalizar set.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao finalizar set.');
    }
  };

  const handleFinish = async () => {
    Alert.alert('Finalizar partida?', 'Tem certeza que deseja encerrar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        style: 'destructive',
        onPress: async () => {
          try {
            await matchService.finishMatch(matchId);
            await reloadMatch();
          } catch (e: any) {
            const raw = e?.response?.data?.message;
            const code = e?.response?.data?.code;
            const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
            const msg = isGeneric ? (code ?? 'Erro ao finalizar') : raw;
            Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao finalizar');
          }
        },
      },
    ]);
  };

  const handleWalkover = (winnerTeam: 'A' | 'B') => {
    const teamName = winnerTeam === 'A'
      ? (match?.teamA?.name?.replace('[Seed T] ', '') ?? 'Time A')
      : (match?.teamB?.name?.replace('[Seed T] ', '') ?? 'Time B');
    Alert.alert('Declarar W.O.?', `${teamName} vence por W.O.?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar W.O.',
        style: 'destructive',
        onPress: async () => {
          try {
            await matchService.declareWalkover(matchId, winnerTeam);
            await reloadMatch();
          } catch (e: any) {
            const raw = e?.response?.data?.message;
            const code = e?.response?.data?.code;
            const isGeneric = typeof raw !== 'string' || raw === 'Bad Request Exception';
            const msg = isGeneric ? (code ?? 'Erro ao declarar W.O.') : raw;
            Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao declarar W.O.');
          }
        },
      },
    ]);
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>PARTIDA</Text>
        </View>
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>PARTIDA</Text>
        </View>
        <View style={s.loader}>
          <Text style={{ color: colors.textMuted }}>Partida não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canReferee = isReferee || isTournamentReferee;
  const isLive = match.status === MatchStatus.IN_PROGRESS;
  const isScheduled = match.status === MatchStatus.SCHEDULED;
  const isFinished = match.status === MatchStatus.FINISHED || match.status === MatchStatus.WALKOVER;
  const currentSet = match.sets?.[match.sets.length - 1];

  // Always use API-fetched timeline; for live matches, append any new socket events
  const displayEvents = isLive && events.length > timelineEvents.length ? events : timelineEvents;

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>PARTIDA</Text>
        {isLive && (
          <View style={s.liveBadge}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>AO VIVO</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Best of sets indicator */}
        {match.bestOfSets && match.bestOfSets > 1 && (
          <View style={s.bestOfRow}>
            <Text style={s.bestOfText}>Melhor de {match.bestOfSets} sets</Text>
          </View>
        )}

        {/* Scoreboard */}
        <View style={s.scoreboard}>
          <View style={s.teamCol}>
            <TeamAvatar avatarUrl={match.teamA?.avatarUrl} name={match.teamA?.name?.replace('[Seed T] ', '') ?? 'TBD'} size={64} />
            <Text style={s.teamName} numberOfLines={1}>{match.teamA?.name?.replace('[Seed T] ', '') ?? 'TBD'}</Text>
            <Text style={s.teamScore}>{isLive && currentSet ? currentSet.scoreA : match.scoreTeamA}</Text>
            {match.bestOfSets && match.bestOfSets > 1 && (
              <Text style={s.setsWonText}>{match.scoreTeamA} sets</Text>
            )}
          </View>

          <View style={s.scoreDivider}>
            <Text style={s.vsText}>×</Text>
          </View>

          <View style={s.teamCol}>
            <TeamAvatar avatarUrl={match.teamB?.avatarUrl} name={match.teamB?.name?.replace('[Seed T] ', '') ?? 'TBD'} size={64} />
            <Text style={s.teamName} numberOfLines={1}>{match.teamB?.name?.replace('[Seed T] ', '') ?? 'TBD'}</Text>
            <Text style={s.teamScore}>{isLive && currentSet ? currentSet.scoreB : match.scoreTeamB}</Text>
            {match.bestOfSets && match.bestOfSets > 1 && (
              <Text style={s.setsWonText}>{match.scoreTeamB} sets</Text>
            )}
          </View>
        </View>

        {/* Sets */}
        {match.sets && match.sets.length > 0 && (
          <View style={s.setsRow}>
            {match.sets.map((set) => (
              <View key={set.id} style={s.setBadge}>
                <Text style={s.setLabel}>SET {set.setNumber}</Text>
                <Text style={s.setScore}>{set.scoreA} × {set.scoreB}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Status badge */}
        {isFinished && (
          <View style={s.finishedBanner}>
            <Ionicons name="trophy" size={20} color={colors.primaryGlow} />
            <Text style={s.finishedText}>
              {match.winnerId
                ? `Vencedor: ${match.winnerId === match.teamAId ? match.teamA?.name?.replace('[Seed T] ', '') : match.teamB?.name?.replace('[Seed T] ', '')}`
                : 'Partida encerrada'}
            </Text>
          </View>
        )}

        {/* Referee controls */}
        {canReferee && !isFinished && (
          <View style={s.controls}>
            <Text style={s.controlsTitle}>
              CONTROLES DO ÁRBITRO
            </Text>

            {isScheduled && (
              <TouchableOpacity style={s.startBtn} onPress={handleStart} disabled={actionLoading}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.startGradient}
                >
                  {actionLoading ? (
                    <ActivityIndicator color={colors.text} />
                  ) : (
                    <>
                      <Ionicons name="play" size={20} color={colors.text} />
                      <Text style={s.startText}>INICIAR PARTIDA</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}

            {isLive && (
              <>
                {/* Point buttons */}
                <View style={s.pointRow}>
                  <View style={s.teamPointCol}>
                    <Text style={s.pointLabel} numberOfLines={1}>{match.teamA?.name?.replace('[Seed T] ', '') ?? 'Time A'}</Text>
                    <View style={s.pointBtnRow}>
                      <TouchableOpacity style={s.pointBtnMinus} onPress={() => handleRemovePoint('A')} activeOpacity={0.7}>
                        <Text style={s.pointMinusText}>-1</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.pointBtnPlus} onPress={() => handlePoint('A')} activeOpacity={0.7}>
                        <LinearGradient
                          colors={['rgba(109,46,192,0.3)', 'rgba(157,115,230,0.3)']}
                          style={s.pointPlusGradient}
                        >
                          <Text style={s.pointPlusText}>+1</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={s.teamPointCol}>
                    <Text style={s.pointLabel} numberOfLines={1}>{match.teamB?.name?.replace('[Seed T] ', '') ?? 'Time B'}</Text>
                    <View style={s.pointBtnRow}>
                      <TouchableOpacity style={s.pointBtnMinus} onPress={() => handleRemovePoint('B')} activeOpacity={0.7}>
                        <Text style={s.pointMinusText}>-1</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.pointBtnPlus} onPress={() => handlePoint('B')} activeOpacity={0.7}>
                        <LinearGradient
                          colors={['rgba(109,46,192,0.3)', 'rgba(157,115,230,0.3)']}
                          style={s.pointPlusGradient}
                        >
                          <Text style={s.pointPlusText}>+1</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Action row */}
                <View style={s.actionRow}>
                  <TouchableOpacity style={s.actionBtn} onPress={handleFinishSet}>
                    <Ionicons name="checkmark-done" size={18} color={colors.primaryGlow} />
                    <Text style={s.actionText}>Finalizar Set</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={handleFinish}>
                    <Ionicons name="stop" size={18} color={colors.error} />
                    <Text style={[s.actionText, { color: colors.error }]}>Finalizar</Text>
                  </TouchableOpacity>
                </View>

                <View style={s.actionRow}>
                  <TouchableOpacity style={s.actionBtn} onPress={() => handleWalkover('A')}>
                    <Text style={s.actionText}>W.O. Time A</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionBtn} onPress={() => handleWalkover('B')}>
                    <Text style={s.actionText}>W.O. Time B</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {/* Event timeline (newest first) */}
        {displayEvents.length > 0 && (
          <View style={s.timeline}>
            <Text style={s.timelineTitle}>TIMELINE</Text>
            {displayEvents.map((ev, i) => (
              <View key={i} style={s.timelineItem}>
                <View style={[
                  s.timelineDot,
                  ev.type === 'SIDE_SWITCH' && { backgroundColor: '#FF9800' },
                  ev.type === 'MATCH_START' && { backgroundColor: colors.primary },
                  ev.type === 'MATCH_FINISH' && { backgroundColor: colors.success },
                  ev.type === 'SET_FINISH' && { backgroundColor: colors.primary },
                  ev.type === 'WALKOVER' && { backgroundColor: colors.error },
                ]} />
                <Text style={s.timelineText}>
                  {ev.type === 'POINT' && `Ponto Time ${ev.team === 'A' ? (match.teamA?.name?.replace('[Seed T] ', '') ?? 'A') : (match.teamB?.name?.replace('[Seed T] ', '') ?? 'B')}`}
                  {ev.type === 'SIDE_SWITCH' && `TROCA DE LADOS`}
                  {ev.type === 'SET_FINISH' && `Set ${ev.setNumber} finalizado (${ev.scoreA} × ${ev.scoreB})`}
                  {ev.type === 'MATCH_START' && 'Partida iniciada'}
                  {ev.type === 'MATCH_FINISH' && 'Partida encerrada'}
                  {ev.type === 'WALKOVER' && `W.O. - Time ${ev.team === 'A' ? (match.teamA?.name?.replace('[Seed T] ', '') ?? 'A') : (match.teamB?.name?.replace('[Seed T] ', '') ?? 'B')} venceu`}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,68,68,0.15)',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4444' },
  liveText: { fontSize: 10, fontFamily: fonts.text.semiBold, color: '#FF4444', letterSpacing: 1.5 },

  content: { paddingHorizontal: spacing.xl },

  // Best of sets indicator
  bestOfRow: { alignItems: 'center', marginBottom: spacing.md },
  bestOfText: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.primaryGlow, letterSpacing: 1.5 },
  setsWonText: { fontSize: 11, fontFamily: fonts.text.medium, color: colors.textMuted, marginTop: 2 },

  // Scoreboard
  scoreboard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  teamCol: { flex: 1, alignItems: 'center', gap: spacing.sm },
  teamName: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.textSecondary, textAlign: 'center' },
  teamScore: { fontSize: 52, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 1 },
  scoreDivider: { paddingHorizontal: spacing.md },
  vsText: { fontSize: 20, fontFamily: fonts.text.regular, color: colors.textMuted },

  // Sets
  setsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  setBadge: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.md,
    alignItems: 'center',
  },
  setLabel: { fontSize: 9, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1.5 },
  setScore: { fontSize: 18, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 1 },

  // Finished
  finishedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(109,46,192,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.2)',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  finishedText: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.primaryGlow },

  // Controls
  controls: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  controlsTitle: {
    fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 2,
  },

  startBtn: { borderRadius: 14, overflow: 'hidden' },
  startGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.lg,
  },
  startText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },

  pointRow: { flexDirection: 'row', gap: spacing.md },
  teamPointCol: { flex: 1, gap: spacing.sm, alignItems: 'center' },
  pointBtnRow: { flexDirection: 'row', gap: spacing.sm },
  pointBtnMinus: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.lg, borderRadius: 12,
    backgroundColor: 'rgba(255,77,77,0.1)', borderWidth: 1, borderColor: 'rgba(255,77,77,0.2)',
  },
  pointMinusText: { fontSize: 20, fontFamily: fonts.title.display, color: colors.error },
  pointBtnPlus: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  pointPlusGradient: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(109,46,192,0.3)', borderRadius: 12,
  },
  pointPlusText: { fontSize: 20, fontFamily: fonts.title.display, color: colors.primaryGlow, letterSpacing: 1 },
  pointLabel: { fontSize: 11, fontFamily: fonts.text.medium, color: colors.textSecondary },

  actionRow: { flexDirection: 'row', gap: spacing.md },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: spacing.md,
  },
  actionText: { fontSize: 12, fontFamily: fonts.text.medium, color: colors.textSecondary },

  // Timeline
  timeline: { marginBottom: spacing.lg },
  timelineTitle: { fontSize: 14, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2, marginBottom: spacing.md },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  timelineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  timelineText: { fontSize: 12, fontFamily: fonts.text.regular, color: colors.textSecondary },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
