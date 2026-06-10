import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BracketResponse, Match, MatchStatus } from '../../../types/match';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';
import type { TournamentStackParamList } from '../../../navigation/types';
import TeamAvatar from '../../../components/TeamAvatar';

type Nav = NativeStackNavigationProp<TournamentStackParamList>;

interface Props {
  brackets: BracketResponse[];
}

const ROUND_LABELS: Record<number, string> = {
  1: 'Final',
  2: 'Semifinal',
  3: 'Quartas de Final',
  4: 'Oitavas de Final',
};

function getRoundLabel(round: number, totalRounds: number): string {
  const fromFinal = totalRounds - round + 1;
  return ROUND_LABELS[fromFinal] ?? `Rodada ${round}`;
}

function getStatusColor(status: MatchStatus) {
  switch (status) {
    case MatchStatus.IN_PROGRESS: return colors.error;
    case MatchStatus.FINISHED: return colors.success;
    case MatchStatus.WALKOVER: return colors.warning;
    default: return 'transparent';
  }
}

export default function PlayoffBracket({ brackets }: Props) {
  const navigation = useNavigation<Nav>();

  if (brackets.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="git-branch-outline" size={40} color={colors.textPlaceholder} />
        </View>
        <Text style={styles.emptyText}>Nenhuma chave gerada</Text>
      </View>
    );
  }

  return (
    <View>
      {brackets.map((bracket) => {
        const matches = [...bracket.matches].sort((a, b) => a.round - b.round || a.position - b.position);
        const maxRound = Math.max(...matches.map((m) => m.round), 1);

        const rounds: Record<number, Match[]> = {};
        for (const m of matches) {
          if (!rounds[m.round]) rounds[m.round] = [];
          rounds[m.round].push(m);
        }

        const roundKeys = Object.keys(rounds).map(Number).sort((a, b) => a - b);

        return (
          <View key={bracket.id} style={styles.bracketSection}>
            <Text style={styles.bracketTitle}>
              {bracket.category.type === 'MALE' ? 'Masculino' : bracket.category.type === 'FEMALE' ? 'Feminino' : 'Misto'} {bracket.category.format === 'PAIR' ? 'Dupla' : bracket.category.format === 'QUARTET' ? 'Quarteto' : 'Sexteto'}
            </Text>

            {roundKeys.map((roundNum, roundIdx) => {
              const roundMatches = rounds[roundNum];
              const isFinal = roundNum === maxRound;
              const isSemifinal = roundNum === maxRound - 1;
              const isLastRound = roundIdx === roundKeys.length - 1;

              let roundLabel: string;
              if (isFinal) roundLabel = 'FINAL';
              else if (isSemifinal) roundLabel = 'SEMIFINAL';
              else roundLabel = getRoundLabel(roundNum, maxRound).toUpperCase();

              return (
                <View key={roundNum} style={styles.roundSection}>
                  {/* Round label */}
                  <View style={styles.roundHeader}>
                    <View style={styles.roundLabelPill}>
                      <Text style={styles.roundLabelText}>{roundLabel}</Text>
                    </View>
                    {isFinal && <Ionicons name="trophy" size={14} color={colors.primary} />}
                  </View>

                  {/* Matches */}
                  {roundMatches.map((match, matchIdx) => {
                    const isTeamAWinner = match.winnerId && match.winnerId === match.teamAId;
                    const isTeamBWinner = match.winnerId && match.winnerId === match.teamBId;
                    const isLive = match.status === MatchStatus.IN_PROGRESS;
                    const isDone = match.status === MatchStatus.FINISHED || match.status === MatchStatus.WALKOVER;
                    const statusColor = getStatusColor(match.status);
                    const hasTeams = match.teamA && match.teamB;

                    return (
                      <TouchableOpacity
                        key={match.id}
                        style={[styles.matchCard, isLive && styles.matchCardLive]}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (hasTeams) {
                            navigation.navigate('LiveMatch', {
                              matchId: match.id,
                              tournamentId: bracket.tournamentId,
                            });
                          }
                        }}
                      >
                        {/* Live indicator bar */}
                        {isLive && <View style={styles.liveBar} />}

                        {/* Team A */}
                        <View style={[styles.teamRow, isTeamAWinner && styles.winnerRow]}>
                          {isTeamAWinner && (
                            <Ionicons name="trophy" size={12} color={colors.primary} style={styles.winnerIcon} />
                          )}
                          <TeamAvatar
                            avatarUrl={match.teamA?.avatarUrl}
                            name={match.teamA?.name ?? 'TBD'}
                            size={36}
                          />
                          <Text
                            style={[styles.teamName, isTeamAWinner && styles.winnerName, !isTeamAWinner && isDone && styles.loserName]}
                            numberOfLines={1}
                          >
                            {match.teamA?.name?.replace('[Seed T] ', '') ?? 'TBD'}
                          </Text>
                          <Text style={[styles.teamScore, isTeamAWinner && styles.winnerScore]}>
                            {isDone || isLive ? match.scoreTeamA : ''}
                          </Text>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider}>
                          <View style={styles.dividerLine} />
                          {hasTeams && (
                            <Text style={styles.dividerVs}>×</Text>
                          )}
                          <View style={styles.dividerLine} />
                        </View>

                        {/* Team B */}
                        <View style={[styles.teamRow, isTeamBWinner && styles.winnerRow]}>
                          {isTeamBWinner && (
                            <Ionicons name="trophy" size={12} color={colors.primary} style={styles.winnerIcon} />
                          )}
                          <TeamAvatar
                            avatarUrl={match.teamB?.avatarUrl}
                            name={match.teamB?.name ?? 'TBD'}
                            size={36}
                          />
                          <Text
                            style={[styles.teamName, isTeamBWinner && styles.winnerName, !isTeamBWinner && isDone && styles.loserName]}
                            numberOfLines={1}
                          >
                            {match.teamB?.name?.replace('[Seed T] ', '') ?? 'TBD'}
                          </Text>
                          <Text style={[styles.teamScore, isTeamBWinner && styles.winnerScore]}>
                            {isDone || isLive ? match.scoreTeamB : ''}
                          </Text>
                        </View>

                        {/* Status badge for live */}
                        {isLive && (
                          <View style={styles.matchStatusBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveLabel}>AO VIVO</Text>
                          </View>
                        )}
                        {isDone && match.winnerId && !isLive && (
                          <View style={styles.matchStatusBadge}>
                            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                            <Text style={styles.doneLabel}>ENCERRADA</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}

                  {/* Connector to next round */}
                  {!isLastRound && (
                    <View style={styles.connectorSection}>
                      <View style={styles.connectorLine} />
                      <Ionicons name="chevron-down" size={16} color="rgba(109,46,192,0.3)" />
                      <View style={styles.connectorLine} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', marginTop: 60, gap: spacing.md },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyText: { fontSize: typography.sizes.input, fontFamily: fonts.text.regular, color: colors.textMuted },

  bracketSection: { marginBottom: spacing.lg },
  bracketTitle: {
    fontSize: typography.sizes.subtitle, fontFamily: fonts.title.regular, color: colors.text,
    letterSpacing: typography.letterSpacing.medium, marginBottom: spacing.lg,
  },

  // Rounds
  roundSection: { marginBottom: spacing.lg },
  roundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  roundLabelPill: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  roundLabelText: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.input,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
  },

  // Match card
  matchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  matchCardLive: {
    borderWidth: 1,
    borderColor: 'rgba(224,69,69,0.3)',
  },
  liveBar: {
    height: 3,
    backgroundColor: colors.error,
  },

  // Teams
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  winnerRow: {
    backgroundColor: 'rgba(109,46,192,0.06)',
  },
  winnerIcon: { marginRight: -2 },
  teamName: {
    flex: 1,
    fontSize: typography.sizes.body,
    fontFamily: fonts.text.medium,
    color: colors.text,
  },
  loserName: { color: colors.textMuted, opacity: 0.6 },
  winnerName: { color: colors.primary, fontFamily: fonts.text.semiBold },
  teamScore: {
    fontSize: typography.sizes.heading,
    fontFamily: fonts.title.regular,
    color: colors.text,
    minWidth: 28,
    textAlign: 'right',
    letterSpacing: 1,
  },
  winnerScore: { color: colors.primary },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0ECF5' },
  dividerVs: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.bold,
    color: colors.textMuted,
  },

  // Status badges
  matchStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderTopWidth: 1,
    borderTopColor: '#F0ECF5',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.error },
  liveLabel: { fontSize: 9, fontFamily: fonts.text.bold, color: colors.error, letterSpacing: 1 },
  doneLabel: { fontSize: 9, fontFamily: fonts.text.bold, color: colors.success, letterSpacing: 0.5 },

  // Connectors
  connectorSection: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: 0,
  },
  connectorLine: {
    width: 2,
    height: 8,
    backgroundColor: 'rgba(109,46,192,0.15)',
  },
});
