import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';
import { spacing } from '../../../theme/spacing';
import type { BracketResponse } from '../../../types/match';
import { BracketMatchCard } from './BracketMatchCard';
import { InlineStandingsTable } from './InlineStandingsTable';
import { computeStandings, groupByRound } from './bracketUtils';

interface Props {
  bracket: BracketResponse;
  multiCategory: boolean;
  categoryLabel: string;
  onPressMatch: (matchId: string) => void;
}

export function RoundRobinBracketView({
  bracket,
  multiCategory,
  categoryLabel,
  onPressMatch,
}: Props) {
  const sortedRounds = groupByRound(bracket.matches);
  const totalRounds = sortedRounds.length;
  const standings = computeStandings(bracket.matches);

  return (
    <View style={styles.section}>
      {multiCategory && <Text style={styles.catTitle}>{categoryLabel}</Text>}
      <InlineStandingsTable standings={standings} title="CLASSIFICAÇÃO" />
      {sortedRounds.map(([roundKey, roundMatches], idx) => {
        const roundNum = Number(roundKey);
        const isPlayoff = idx === totalRounds - 1 && totalRounds > 1;
        const label = isPlayoff ? 'Playoffs' : `Rodada ${roundNum}`;
        return (
          <View key={roundNum} style={styles.roundSection}>
            <Text style={styles.roundLabel}>{label}</Text>
            <View style={styles.matches}>
              {roundMatches.map((m) => (
                <BracketMatchCard key={m.id} match={m} onPress={onPressMatch} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.lg },
  catTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  roundSection: { marginBottom: spacing.md },
  roundLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  matches: { gap: spacing.sm },
});
