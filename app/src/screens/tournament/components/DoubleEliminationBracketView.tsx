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

export function DoubleEliminationBracketView({
  bracket,
  multiCategory,
  categoryLabel,
  onPressMatch,
}: Props) {
  const winnersMatches = bracket.matches.filter((m) => m.group === 0 || m.group === null);
  const losersMatches = bracket.matches.filter((m) => m.group === 1);
  const grandFinal = bracket.matches.filter((m) => m.group === 2);

  const groupByRound = (matches: Match[]): [string, Match[]][] => {
    const sorted = [...matches].sort(
      (a, b) => a.round - b.round || a.position - b.position,
    );
    const rounds: Record<number, Match[]> = {};
    for (const m of sorted) {
      if (!rounds[m.round]) rounds[m.round] = [];
      rounds[m.round].push(m);
    }
    return Object.entries(rounds).sort(([a], [b]) => Number(a) - Number(b));
  };

  const winnersRounds = groupByRound(winnersMatches);
  const losersRounds = groupByRound(losersMatches);
  const maxWinnersRound =
    winnersMatches.length > 0 ? Math.max(...winnersMatches.map((m) => m.round)) : 1;

  return (
    <View style={styles.section}>
      {multiCategory && <Text style={styles.catTitle}>{categoryLabel}</Text>}

      <Text style={styles.groupTitle}>Chave Principal</Text>
      {winnersRounds.map(([roundKey, roundMatches]) => {
        const roundNum = Number(roundKey);
        const fromFinal = maxWinnersRound - roundNum + 1;
        const label = ROUND_LABELS[fromFinal] ?? `Rodada ${roundNum}`;
        return (
          <View key={`W${roundNum}`} style={styles.roundSection}>
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

      {losersRounds.length > 0 && (
        <>
          <Text style={[styles.groupTitle, { marginTop: spacing.md }]}>Repescagem</Text>
          {losersRounds.map(([roundKey, roundMatches]) => {
            const roundNum = Number(roundKey);
            const label = `Rodada ${roundNum}`;
            return (
              <View key={`L${roundNum}`} style={styles.roundSection}>
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
        </>
      )}

      {grandFinal.length > 0 && (
        <View style={styles.roundSection}>
          <Text style={styles.roundLabel}>Grande Final</Text>
          <View style={styles.matches}>
            {grandFinal.map((m) => (
              <BracketMatchCard key={m.id} match={m} onPress={onPressMatch} />
            ))}
          </View>
        </View>
      )}
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
  groupTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 16,
    color: colors.text,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
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
