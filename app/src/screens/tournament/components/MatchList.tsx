import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Match, MatchStatus } from '../../../types/match';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import type { TournamentStackParamList } from '../../../navigation/types';
import TeamAvatar from '../../../components/TeamAvatar';

type Nav = NativeStackNavigationProp<TournamentStackParamList>;

interface Props {
  matches: Match[];
  tournamentId: string;
  isReferee?: boolean;
}

const GROUP_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function hasGroupPhase(matches: Match[]): boolean {
  return matches.some((m) => m.group !== null && m.group !== undefined);
}

function sortMatches(matches: Match[]): Match[] {
  const groupPhase = hasGroupPhase(matches);

  if (groupPhase) {
    const groupMatches = matches.filter((m) => m.group !== null && m.group !== undefined);
    const elimMatches = matches.filter((m) => m.group === null || m.group === undefined);

    const byGroup = new Map<number, Match[]>();
    for (const m of groupMatches) {
      const g = m.group ?? 0;
      if (!byGroup.has(g)) byGroup.set(g, []);
      byGroup.get(g)!.push(m);
    }

    for (const [, gMatches] of byGroup) {
      gMatches.sort((a, b) => a.round - b.round || a.position - b.position);
    }

    const sortedGroups = [...byGroup.keys()].sort((a, b) => a - b);
    const maxLen = Math.max(...[...byGroup.values()].map(gm => gm.length), 0);
    const interleaved: Match[] = [];
    for (let i = 0; i < maxLen; i++) {
      for (const gKey of sortedGroups) {
        const gMatches = byGroup.get(gKey)!;
        if (i < gMatches.length) {
          interleaved.push(gMatches[i]);
        }
      }
    }

    const sortedElim = [...elimMatches].sort((a, b) => a.round - b.round || a.position - b.position);
    return [...interleaved, ...sortedElim];
  }

  return [...matches].sort((a, b) => a.round - b.round || a.position - b.position);
}

function getMatchLabel(match: Match): string {
  if (match.label === 'FINAL') return 'FINAL';
  if (match.label === 'TERCEIRO_LUGAR') return '3º E 4º LUGAR';
  if (match.label === 'SEMIFINAL 1' || match.label === 'SEMIFINAL 2') return 'SEMIFINAL';
  if (match.label === 'SEMIFINAL') return 'SEMIFINAL';
  if (match.group !== null && match.group !== undefined) return `GRUPO ${GROUP_LABELS[match.group] ?? match.group + 1}`;
  return `RODADA ${match.round}`;
}

export default function MatchList({ matches, tournamentId, isReferee }: Props) {
  const navigation = useNavigation<Nav>();

  if (matches.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="calendar-outline" size={40} color={colors.textPlaceholder} />
        </View>
        <Text style={styles.emptyTitle}>NENHUM JOGO</Text>
        <Text style={styles.emptyText}>Os jogos aparecerão aqui quando o chaveamento for gerado</Text>
      </View>
    );
  }

  const sorted = sortMatches(matches);

  // Group by label for visual separation
  const grouped: { label: string; matches: Match[] }[] = [];
  for (const m of sorted) {
    const label = getMatchLabel(m);
    const last = grouped[grouped.length - 1];
    if (last && last.label === label) {
      last.matches.push(m);
    } else {
      grouped.push({ label, matches: [m] });
    }
  }

  return (
    <View>
      {grouped.map((group, gi) => (
        <View key={gi} style={styles.groupSection}>
          {/* Group label */}
          <View style={styles.groupHeader}>
            <View style={styles.groupDot} />
            <Text style={styles.groupLabel}>{group.label}</Text>
          </View>

          {/* Matches */}
          {group.matches.map((match) => {
            const isLive = match.status === MatchStatus.IN_PROGRESS;
            const isDone = match.status === MatchStatus.FINISHED || match.status === MatchStatus.WALKOVER;
            const isScheduled = match.status === MatchStatus.SCHEDULED;
            const hasTeams = match.teamA && match.teamB;
            const isTeamAWinner = isDone && match.winnerId === match.teamAId;
            const isTeamBWinner = isDone && match.winnerId === match.teamBId;

            return (
              <TouchableOpacity
                key={match.id}
                style={[styles.card, isLive && styles.cardLive]}
                activeOpacity={0.7}
                onPress={() => {
                  if (hasTeams) {
                    navigation.navigate('LiveMatch', { matchId: match.id, tournamentId });
                  }
                }}
              >
                {/* Live bar */}
                {isLive && <View style={styles.liveBar} />}

                <View style={styles.cardContent}>
                  {/* Team A row */}
                  <View style={[styles.teamRow, isTeamAWinner && styles.winnerRow]}>
                    <TeamAvatar avatarUrl={match.teamA?.avatarUrl} name={match.teamA?.name ?? 'TBD'} size={40} />
                    <Text
                      style={[styles.teamName, isTeamAWinner && styles.teamNameWinner, !isTeamAWinner && isDone && styles.teamNameLoser]}
                      numberOfLines={1}
                    >
                      {match.teamA?.name?.replace('[Seed T] ', '') ?? 'TBD'}
                    </Text>
                    <View style={[styles.scoreBox, isTeamAWinner && styles.scoreBoxWinner]}>
                      <Text style={[styles.scoreText, isTeamAWinner && styles.scoreTextWinner]}>
                        {isDone || isLive ? match.scoreTeamA : '-'}
                      </Text>
                    </View>
                  </View>

                  {/* Team B row */}
                  <View style={[styles.teamRow, isTeamBWinner && styles.winnerRow]}>
                    <TeamAvatar avatarUrl={match.teamB?.avatarUrl} name={match.teamB?.name ?? 'TBD'} size={40} />
                    <Text
                      style={[styles.teamName, isTeamBWinner && styles.teamNameWinner, !isTeamBWinner && isDone && styles.teamNameLoser]}
                      numberOfLines={1}
                    >
                      {match.teamB?.name?.replace('[Seed T] ', '') ?? 'TBD'}
                    </Text>
                    <View style={[styles.scoreBox, isTeamBWinner && styles.scoreBoxWinner]}>
                      <Text style={[styles.scoreText, isTeamBWinner && styles.scoreTextWinner]}>
                        {isDone || isLive ? match.scoreTeamB : '-'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Footer: status + referee */}
                <View style={styles.cardFooter}>
                  {/* Status */}
                  <View style={styles.statusArea}>
                    {isLive && (
                      <>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveLabel}>AO VIVO</Text>
                      </>
                    )}
                    {isDone && (
                      <>
                        <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                        <Text style={styles.doneLabel}>ENCERRADA</Text>
                      </>
                    )}
                    {isScheduled && (
                      <>
                        <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                        <Text style={styles.scheduledLabel}>AGENDADA</Text>
                      </>
                    )}
                  </View>

                  {/* Referee action */}
                  {isReferee && hasTeams && (isScheduled || isLive) && (
                    <TouchableOpacity
                      style={styles.refBtn}
                      onPress={() => navigation.navigate('LiveMatch', { matchId: match.id, tournamentId })}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="flag" size={14} color="#FFFFFF" />
                      <Text style={styles.refBtnText}>
                        {isScheduled ? 'APITAR' : 'ARBITRAR'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // Empty
  empty: { alignItems: 'center', marginTop: 60, gap: spacing.sm },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  emptyText: { fontSize: typography.sizes.body, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center' },

  // Group sections
  groupSection: { marginBottom: spacing.lg },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  groupDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.primary,
  },
  groupLabel: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
  },

  // Match card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLive: {
    borderWidth: 1,
    borderColor: 'rgba(224,69,69,0.25)',
  },
  liveBar: {
    height: 3,
    backgroundColor: colors.error,
  },
  cardContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },

  // Team row
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  winnerRow: {
    backgroundColor: 'rgba(109,46,192,0.06)',
  },
  teamName: {
    flex: 1,
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
  },
  teamNameWinner: { color: colors.primary },
  teamNameLoser: { color: colors.textMuted, opacity: 0.6 },
  scoreBox: {
    minWidth: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBoxWinner: {
    backgroundColor: colors.primary,
  },
  scoreText: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.subtitle,
    color: colors.primary,
    letterSpacing: 1,
  },
  scoreTextWinner: {
    color: '#FFFFFF',
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0ECF5',
  },
  statusArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.error },
  liveLabel: { fontSize: 9, fontFamily: fonts.text.bold, color: colors.error, letterSpacing: 1 },
  doneLabel: { fontSize: 9, fontFamily: fonts.text.bold, color: colors.success, letterSpacing: 0.5 },
  scheduledLabel: { fontSize: 9, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 0.5 },

  // Referee button
  refBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  refBtnText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
