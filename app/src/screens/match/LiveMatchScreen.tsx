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
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { matchService } from '../../services/match';
import { useLiveMatchStore } from '../../stores/matchStore';
import { useAuthStore } from '../../stores/authStore';
import { Match, MatchStatus } from '../../types/match';
import TeamAvatar from '../../components/TeamAvatar';
import ChevronButton from '../../components/ChevronButton';
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
  const [selectedSet, setSelectedSet] = useState<number | null>(null);

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
          if (isFriendly) {
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
            const found = await matchService.findOne(matchId) as Match;
            if (found && mounted) {
              setMatch(found);
              const isDone = found.status === MatchStatus.FINISHED || found.status === MatchStatus.WALKOVER;
              if (!isDone) {
                joinMatch(found, tournamentId);
              }
              loadTimeline();
            }
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
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.topTitle}>PARTIDA</Text>
          <View style={{ width: 36 }} />
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
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={s.topTitle}>PARTIDA</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={s.loader}>
          <Text style={{ color: colors.textPlaceholder }}>Partida não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canReferee = isReferee || isTournamentReferee;
  const isLive = match.status === MatchStatus.IN_PROGRESS;
  const isScheduled = match.status === MatchStatus.SCHEDULED;
  const isFinished = match.status === MatchStatus.FINISHED || match.status === MatchStatus.WALKOVER;
  const currentSet = match.sets?.[match.sets.length - 1];
  const currentSetNum = currentSet?.setNumber ?? 1;

  const setsWonA = match.sets?.filter((set) => set.scoreA > set.scoreB).length ?? 0;
  const setsWonB = match.sets?.filter((set) => set.scoreB > set.scoreA).length ?? 0;

  const cleanName = (name?: string | null) => name?.replace('[Seed T] ', '') ?? 'TBD';

  const getFilteredEvents = () => {
    const activeSet = selectedSet ?? currentSetNum;
    const apiFiltered = timelineEvents.filter(ev =>
      ev.setNumber === activeSet || ev.type === 'MATCH_START' || ev.type === 'MATCH_FINISH'
    );
    if (activeSet === currentSetNum && isLive) {
      const newestApiTs = apiFiltered.length > 0
        ? new Date(apiFiltered[0].timestamp).getTime()
        : 0;
      const newSocketEvents = events.filter(ev =>
        (ev.setNumber === activeSet || ev.setNumber === undefined) &&
        new Date(ev.timestamp).getTime() > newestApiTs
      );
      return [...newSocketEvents, ...apiFiltered];
    }
    return apiFiltered;
  };

  const displayEvents = getFilteredEvents();

  const scoreA = isLive && currentSet ? currentSet.scoreA : (currentSet?.scoreA ?? 0);
  const scoreB = isLive && currentSet ? currentSet.scoreB : (currentSet?.scoreB ?? 0);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={s.topCenter}>
          <Text style={s.matchLabel}>{match.label ?? 'PARTIDA'}</Text>
          {isLive && (
            <View style={s.liveBadge}>
              <View style={s.liveDot} />
              <Text style={s.liveText}>AO VIVO</Text>
            </View>
          )}
          {isFinished && (
            <View style={s.finishedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={s.finishedBadgeText}>ENCERRADA</Text>
            </View>
          )}
        </View>

        <View style={s.setIndicator}>
          <Ionicons name="timer-outline" size={14} color={colors.textMuted} />
          <Text style={s.setIndicatorText}>Set {currentSetNum}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Team names + sets won */}
        <View style={s.teamsHeader}>
          <View style={s.teamHeaderCol}>
            <TeamAvatar avatarUrl={match.teamA?.avatarUrl} name={cleanName(match.teamA?.name)} size={48} />
            <Text style={s.teamHeaderName} numberOfLines={1}>{cleanName(match.teamA?.name)}</Text>
            <Text style={s.setsWon}>Sets: {setsWonA}</Text>
          </View>
          <View style={s.vsCol}>
            <Text style={s.vsText}>VS</Text>
          </View>
          <View style={[s.teamHeaderCol, { alignItems: 'flex-end' }]}>
            <TeamAvatar avatarUrl={match.teamB?.avatarUrl} name={cleanName(match.teamB?.name)} size={48} />
            <Text style={[s.teamHeaderName, { textAlign: 'right' }]} numberOfLines={1}>{cleanName(match.teamB?.name)}</Text>
            <Text style={s.setsWon}>Sets: {setsWonB}</Text>
          </View>
        </View>

        {/* Score boxes */}
        {(isLive || isFinished) && (
          <View style={s.scoreBoxes}>
            <View style={s.scoreBox}>
              <TouchableOpacity style={s.scoreTapArea} onPress={() => handlePoint('A')} activeOpacity={0.7}>
                <Text style={s.scoreValue}>{scoreA}</Text>
              </TouchableOpacity>
              <View style={s.scoreBtnRow}>
                <TouchableOpacity style={s.minusBtn} onPress={() => handleRemovePoint('A')} activeOpacity={0.7}>
                  <Ionicons name="remove" size={18} color={colors.textMuted} />
                </TouchableOpacity>
                <View style={s.scoreBtnDivider} />
                <TouchableOpacity style={s.plusBtn} onPress={() => handlePoint('A')} activeOpacity={0.7}>
                  <Ionicons name="add" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.scoreBox}>
              <TouchableOpacity style={s.scoreTapArea} onPress={() => handlePoint('B')} activeOpacity={0.7}>
                <Text style={s.scoreValue}>{scoreB}</Text>
              </TouchableOpacity>
              <View style={s.scoreBtnRow}>
                <TouchableOpacity style={s.minusBtn} onPress={() => handleRemovePoint('B')} activeOpacity={0.7}>
                  <Ionicons name="remove" size={18} color={colors.textMuted} />
                </TouchableOpacity>
                <View style={s.scoreBtnDivider} />
                <TouchableOpacity style={s.plusBtn} onPress={() => handlePoint('B')} activeOpacity={0.7}>
                  <Ionicons name="add" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Sets chips */}
        {match.sets && match.sets.length > 0 && (
          <View style={s.setsCard}>
            <Text style={s.setsCardTitle}>SETS</Text>
            <View style={s.setsChips}>
              {match.sets.map((set) => {
                const isActive = isLive && set.setNumber === currentSetNum;
                const isSelected = selectedSet === set.setNumber;
                const isSetFinished = set.scoreA !== set.scoreB;
                return (
                  <TouchableOpacity
                    key={set.id}
                    style={[
                      s.setChip,
                      isActive && s.setChipLive,
                      isSelected && !isActive && s.setChipSelected,
                      isSetFinished && !isActive && s.setChipFinished,
                    ]}
                    onPress={() => setSelectedSet(set.setNumber)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      s.setChipText,
                      isActive && s.setChipTextLive,
                      isSelected && !isActive && s.setChipTextSelected,
                      isSetFinished && !isActive && s.setChipTextActive,
                    ]}>
                      {set.setNumber}: {set.scoreA}–{set.scoreB}
                    </Text>
                    {isActive && <View style={s.liveChipDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Winner banner */}
        {isFinished && match.winnerId && (
          <View style={s.winnerBanner}>
            <Ionicons name="trophy" size={24} color={colors.primaryLight} />
            <View>
              <Text style={s.winnerLabel}>VENCEDOR</Text>
              <Text style={s.winnerName}>
                {match.winnerId === match.teamAId ? cleanName(match.teamA?.name) : cleanName(match.teamB?.name)}
              </Text>
            </View>
          </View>
        )}

        {/* Referee controls */}
        {canReferee && !isFinished && (
          <View style={s.controlsCard}>
            <Text style={s.controlsTitle}>CONTROLES DO ÁRBITRO</Text>

            {isScheduled && (
              <ChevronButton
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleStart}
                disabled={actionLoading}
                icon={<Ionicons name="play" size={16} color="#FFFFFF" />}
              >
                {actionLoading ? 'INICIANDO...' : 'INICIAR PARTIDA'}
              </ChevronButton>
            )}

            {isLive && (
              <>
                {/* Action chips */}
                <View style={s.actionChips}>
                  <TouchableOpacity style={s.actionChip} activeOpacity={0.7}>
                    <Ionicons name="time-outline" size={18} color={colors.primary} />
                    <Text style={s.actionChipText}>Timeout</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionChip} activeOpacity={0.7}>
                    <Ionicons name="swap-horizontal-outline" size={18} color={colors.primary} />
                    <Text style={s.actionChipText}>Subst.</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionChip} onPress={() => {
                    Alert.alert('W.O.', 'Qual time vence por W.O.?', [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: cleanName(match.teamA?.name), onPress: () => handleWalkover('A') },
                      { text: cleanName(match.teamB?.name), onPress: () => handleWalkover('B') },
                    ]);
                  }} activeOpacity={0.7}>
                    <Ionicons name="trophy-outline" size={18} color={colors.primary} />
                    <Text style={s.actionChipText}>W.O.</Text>
                  </TouchableOpacity>
                </View>

                {/* Finish buttons */}
                <View style={s.finishRow}>
                  <ChevronButton
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleFinishSet}
                    icon={<Ionicons name="checkmark-done" size={16} color="#FFFFFF" />}
                  >
                    ENCERRAR SET
                  </ChevronButton>
                </View>
                <TouchableOpacity style={s.finishMatchBtn} onPress={handleFinish} activeOpacity={0.7}>
                  <Ionicons name="stop-circle-outline" size={18} color={colors.textMuted} />
                  <Text style={s.finishMatchText}>FINALIZAR PARTIDA</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Event timeline */}
        {displayEvents.length > 0 && (
          <View style={s.timeline}>
            <Text style={s.timelineTitle}>TIMELINE</Text>
            <View style={s.timelineList}>
              {displayEvents.map((ev, i) => {
                const isPoint = ev.type === 'POINT';
                const isStart = ev.type === 'MATCH_START';
                const isMatchEnd = ev.type === 'MATCH_FINISH';
                const isSetEnd = ev.type === 'SET_FINISH';

                return (
                  <View key={i} style={s.timelineItem}>
                    <View style={[
                      s.tlDot,
                      isPoint && { backgroundColor: colors.primary },
                      isStart && { backgroundColor: colors.success },
                      isMatchEnd && { backgroundColor: colors.success },
                      isSetEnd && { backgroundColor: colors.primaryLight },
                      ev.type === 'SIDE_SWITCH' && { backgroundColor: '#FF9800' },
                      ev.type === 'WALKOVER' && { backgroundColor: colors.error },
                    ]} />
                    <Text style={s.tlText}>
                      {ev.type === 'POINT' && `Ponto ${ev.team === 'A' ? cleanName(match.teamA?.name) : cleanName(match.teamB?.name)}`}
                      {ev.type === 'SIDE_SWITCH' && 'TROCA DE LADOS'}
                      {ev.type === 'SET_FINISH' && `Set ${ev.setNumber} finalizado (${ev.scoreA} × ${ev.scoreB})`}
                      {ev.type === 'MATCH_START' && 'Partida iniciada'}
                      {ev.type === 'MATCH_FINISH' && 'Partida encerrada'}
                      {ev.type === 'WALKOVER' && `W.O. — ${ev.team === 'A' ? cleanName(match.teamA?.name) : cleanName(match.teamB?.name)} venceu`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  topCenter: { alignItems: 'center', gap: 4 },
  topTitle: { fontSize: typography.sizes.md, fontFamily: fonts.text.regular, color: colors.textMuted },
  matchLabel: { fontFamily: fonts.title.regular, fontSize: typography.sizes.subtitle, color: colors.text, letterSpacing: 0.5 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(224,69,69,0.1)',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E04545' },
  liveText: { fontSize: 10, fontFamily: fonts.text.semiBold, color: '#E04545', letterSpacing: 1.5 },
  finishedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(31,184,122,0.1)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  finishedBadgeText: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.success, letterSpacing: 1 },
  setIndicator: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  setIndicatorText: { fontSize: 11, fontFamily: fonts.text.semiBold, color: colors.primary, letterSpacing: 0.5 },

  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },

  // Teams header
  teamsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  teamHeaderCol: { flex: 1, gap: spacing.xs },
  teamHeaderName: { fontFamily: fonts.title.regular, fontSize: typography.sizes.heading, color: colors.text, letterSpacing: 0.4 },
  setsWon: { fontSize: 11, fontFamily: fonts.text.medium, color: colors.textMuted },
  vsCol: { paddingHorizontal: spacing.md },
  vsText: { fontFamily: fonts.title.regular, fontSize: typography.sizes.subtitle, color: colors.textMuted },

  // Score boxes
  scoreBoxes: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  scoreBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreTapArea: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: fonts.title.regular,
    fontSize: 72,
    color: colors.text,
    lineHeight: 80,
    letterSpacing: 2,
  },
  scoreBtnRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EDEDF0',
  },
  minusBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBtnDivider: { width: 1, backgroundColor: '#EDEDF0' },

  // Sets card
  setsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  setsCardTitle: { fontFamily: fonts.title.regular, fontSize: 14, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.md },
  setsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  setChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryTint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setChipLive: { backgroundColor: 'rgba(224,69,69,0.1)', borderWidth: 1, borderColor: 'rgba(224,69,69,0.3)' },
  setChipSelected: { backgroundColor: 'rgba(109,46,192,0.15)', borderWidth: 1, borderColor: 'rgba(109,46,192,0.3)' },
  setChipFinished: { backgroundColor: colors.primary },
  setChipText: { fontFamily: fonts.title.regular, fontSize: 13, color: colors.text, letterSpacing: 0.5 },
  setChipTextLive: { color: '#C0392B' },
  setChipTextSelected: { color: colors.primary },
  setChipTextActive: { color: '#FFFFFF' },
  liveChipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E04545' },

  // Winner
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: 'rgba(109,46,192,0.08)',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.2)',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  winnerLabel: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1 },
  winnerName: { fontFamily: fonts.title.regular, fontSize: typography.sizes.heading, color: colors.primary, letterSpacing: 0.5 },

  // Controls
  controlsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  controlsTitle: {
    fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold,
    color: colors.textMuted, letterSpacing: typography.letterSpacing.medium,
  },

  // Action chips
  actionChips: { flexDirection: 'row', gap: spacing.md },
  actionChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.15)',
    paddingVertical: spacing.md,
  },
  actionChipText: { fontSize: 11, fontFamily: fonts.text.medium, color: colors.primary },

  // Finish
  finishRow: { marginBottom: spacing.sm },
  finishMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  finishMatchText: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 0.5 },

  // Timeline
  timeline: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  timelineTitle: {
    fontSize: typography.sizes.heading, fontFamily: fonts.title.regular,
    color: colors.text, letterSpacing: typography.letterSpacing.medium, marginBottom: spacing.lg,
  },
  timelineList: { gap: spacing.md },
  timelineItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  tlText: { fontSize: typography.sizes.md, fontFamily: fonts.text.regular, color: colors.textSecondary, flex: 1 },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
