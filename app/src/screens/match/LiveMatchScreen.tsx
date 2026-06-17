import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { MatchStatus } from '../../types/match';
import { useMatchInit } from './hooks/useMatchInit';
import { useMatchActions } from './hooks/useMatchActions';
import { cleanName, getFilteredEvents } from './utils';
import { MatchTopBar } from './components/MatchTopBar';
import { MatchTeamsHeader } from './components/MatchTeamsHeader';
import { MatchScoreBoard } from './components/MatchScoreBoard';
import { MatchSetsSelector } from './components/MatchSetsSelector';
import { MatchWinnerBanner } from './components/MatchWinnerBanner';
import { MatchRefereeControls } from './components/MatchRefereeControls';
import { MatchEventTimeline } from './components/MatchEventTimeline';

export default function LiveMatchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params;
  const matchId = params.matchId as string;
  const tournamentId = params.tournamentId as string | undefined;
  const userId = useAuthStore((s) => s.user?.id);

  const [selectedSet, setSelectedSet] = useState<number | null>(null);

  const {
    match,
    events,
    isReferee,
    initialLoading,
    isTournamentReferee,
    timelineEvents,
    reloadMatch,
  } = useMatchInit({ matchId, tournamentId, userId });

  const {
    actionLoading,
    handleStart,
    handlePoint,
    handleRemovePoint,
    handleFinishSet,
    handleFinish,
    handleWalkover,
  } = useMatchActions({ matchId, reloadMatch });

  const renderTopShell = (children: React.ReactNode) => (
    <SafeAreaView style={styles.root} edges={['top']}>
      <MatchTopBar
        label={match?.label ?? 'PARTIDA'}
        isLive={false}
        isFinished={false}
        currentSetNum={1}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.loader}>{children}</View>
    </SafeAreaView>
  );

  if (initialLoading) {
    return renderTopShell(<ActivityIndicator size="large" color={colors.primary} />);
  }

  if (!match) {
    return renderTopShell(
      <Text style={{ color: colors.textPlaceholder }}>Partida não encontrada</Text>,
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

  const teamAName = cleanName(match.teamA?.name);
  const teamBName = cleanName(match.teamB?.name);

  const displayEvents = getFilteredEvents(
    timelineEvents,
    events,
    selectedSet,
    currentSetNum,
    isLive,
  );

  const scoreA = isLive && currentSet ? currentSet.scoreA : (currentSet?.scoreA ?? 0);
  const scoreB = isLive && currentSet ? currentSet.scoreB : (currentSet?.scoreB ?? 0);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <MatchTopBar
        label={match.label}
        isLive={isLive}
        isFinished={isFinished}
        currentSetNum={currentSetNum}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MatchTeamsHeader
          nameA={teamAName}
          nameB={teamBName}
          avatarA={match.teamA?.avatarUrl}
          avatarB={match.teamB?.avatarUrl}
          setsWonA={setsWonA}
          setsWonB={setsWonB}
        />

        {(isLive || isFinished) && (
          <MatchScoreBoard
            scoreA={scoreA}
            scoreB={scoreB}
            onPoint={handlePoint}
            onRemovePoint={handleRemovePoint}
          />
        )}

        {match.sets && match.sets.length > 0 && (
          <MatchSetsSelector
            sets={match.sets}
            isLive={isLive}
            currentSetNum={currentSetNum}
            selectedSet={selectedSet}
            onSelect={setSelectedSet}
          />
        )}

        {isFinished && match.winnerId && (
          <MatchWinnerBanner
            winnerName={match.winnerId === match.teamAId ? teamAName : teamBName}
          />
        )}

        {canReferee && !isFinished && (
          <MatchRefereeControls
            isScheduled={isScheduled}
            isLive={isLive}
            actionLoading={actionLoading}
            teamAName={teamAName}
            teamBName={teamBName}
            onStart={handleStart}
            onFinishSet={() => handleFinishSet(currentSet)}
            onFinish={handleFinish}
            onWalkover={(w) => handleWalkover(w, teamAName, teamBName)}
          />
        )}

        <MatchEventTimeline events={displayEvents} teamAName={teamAName} teamBName={teamBName} />

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
