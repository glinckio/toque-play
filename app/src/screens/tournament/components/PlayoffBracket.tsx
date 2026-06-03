import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BracketResponse, Match, MatchStatus } from '../../../types/match';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
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

export default function PlayoffBracket({ brackets }: Props) {
  const navigation = useNavigation<Nav>();

  if (brackets.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="git-branch-outline" size={40} color={colors.textMuted} />
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

        return (
          <View key={bracket.id} style={styles.bracketSection}>
            <Text style={styles.bracketTitle}>
              {bracket.category.type === 'MALE' ? 'Masculino' : bracket.category.type === 'FEMALE' ? 'Feminino' : 'Misto'} {bracket.category.format === 'PAIR' ? 'Dupla' : bracket.category.format === 'QUARTET' ? 'Quarteto' : 'Sexteto'}
            </Text>

            {Object.keys(rounds).sort((a, b) => Number(a) - Number(b)).map((roundKey) => {
              const roundNum = Number(roundKey);
              const roundMatches = rounds[roundNum];

              return (
                <View key={roundNum} style={styles.roundSection}>
                  <Text style={styles.roundTitle}>
                    {roundNum === maxRound ? 'FINAL (1º e 2º Lugar)' : roundNum === maxRound - 1 ? 'SEMIFINAL' : getRoundLabel(roundNum, maxRound)}
                  </Text>
                  {roundMatches.map((match) => {
                    const isTeamAWinner = match.winnerId && match.winnerId === match.teamAId;
                    const isTeamBWinner = match.winnerId && match.winnerId === match.teamBId;

                    return (
                      <TouchableOpacity
                        key={match.id}
                        style={styles.matchup}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (match.teamA && match.teamB) {
                            navigation.navigate('LiveMatch', {
                              matchId: match.id,
                              tournamentId: bracket.tournamentId,
                            });
                          }
                        }}
                      >
                        <View style={[styles.teamRow, isTeamAWinner && styles.winnerRowBg]}>
                          <TeamAvatar avatarUrl={match.teamA?.avatarUrl} name={match.teamA?.name ?? 'TBD'} size={64} />
                          <Text
                            style={[styles.teamName, isTeamAWinner && styles.winnerText]}
                            numberOfLines={1}
                          >
                            {match.teamA?.name ?? 'TBD'}
                          </Text>
                          <Text style={[styles.teamScore, isTeamAWinner && styles.winnerText]}>
                            {match.status !== MatchStatus.SCHEDULED ? match.scoreTeamA : ''}
                          </Text>
                        </View>
                        <View style={styles.vsLine} />
                        <View style={[styles.teamRow, isTeamBWinner && styles.winnerRowBg]}>
                          <TeamAvatar avatarUrl={match.teamB?.avatarUrl} name={match.teamB?.name ?? 'TBD'} size={32} />
                          <Text
                            style={[styles.teamName, isTeamBWinner && styles.winnerText]}
                            numberOfLines={1}
                          >
                            {match.teamB?.name ?? 'TBD'}
                          </Text>
                          <Text style={[styles.teamScore, isTeamBWinner && styles.winnerText]}>
                            {match.status !== MatchStatus.SCHEDULED ? match.scoreTeamB : ''}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
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
  emptyText: { fontSize: 14, fontFamily: fonts.text.regular, color: colors.textMuted },
  bracketSection: { marginBottom: spacing.lg },
  bracketTitle: {
    fontSize: 20, fontFamily: fonts.title.display, color: colors.text,
    letterSpacing: 2, marginBottom: spacing.md,
  },
  roundSection: { marginBottom: spacing.lg },
  roundTitle: {
    fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.textMuted,
    marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 2,
  },
  matchup: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  teamRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm,
  },
  winnerRowBg: { backgroundColor: 'rgba(109,46,192,0.12)' },
  teamName: {
    flex: 1, fontSize: 14, fontFamily: fonts.text.regular, color: colors.textSecondary,
  },
  teamScore: {
    fontSize: 16, fontFamily: fonts.text.bold, color: colors.text,
    minWidth: 28, textAlign: 'right',
  },
  winnerText: { color: colors.primaryGlow, fontFamily: fonts.text.semiBold },
  vsLine: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
});
