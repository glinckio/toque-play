import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';
import { spacing } from '../../../theme/spacing';
import type { BracketResponse, Match } from '../../../types/match';
import { BracketMatchCard } from './BracketMatchCard';
import { ROUND_LABELS } from '../detail/detail.constants';

interface Props {
  bracket: BracketResponse;
  multiCategory: boolean;
  categoryLabel: string;
  onPressMatch: (matchId: string) => void;
}

export function EliminationBracketView({
  bracket,
  multiCategory,
  categoryLabel,
  onPressMatch,
}: Props) {
  const elimMatches = bracket.matches.filter((m) => m.group === null);
  if (elimMatches.length === 0) return null;

  const sorted = [...elimMatches].sort(
    (a, b) => a.round - b.round || a.position - b.position,
  );
  const maxRound = Math.max(...sorted.map((m) => m.round), 1);
  const rounds: Record<number, Match[]> = {};
  for (const m of sorted) {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  }
  const sortedRounds = Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <View style={styles.section}>
      {multiCategory && <Text style={styles.catTitle}>{categoryLabel}</Text>}
      {sortedRounds.map(([roundKey, roundMatches]) => {
        const roundNum = Number(roundKey);
        const fromFinal = maxRound - roundNum + 1;
        const label = ROUND_LABELS[fromFinal] ?? `Rodada ${roundNum}`;
        return (
          <View key={roundNum} style={styles.roundSection}>
            <Text style={styles.roundLabel}>{label}</Text>
            <View style={styles.matches}>
              {roundMatches
                .sort((a, b) => a.position - b.position)
                .map((m) => (
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
