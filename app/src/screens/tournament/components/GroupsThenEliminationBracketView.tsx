import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';
import { spacing } from '../../../theme/spacing';
import type { BracketResponse, Match } from '../../../types/match';
import { BracketMatchCard } from './BracketMatchCard';
import { InlineStandingsTable } from './InlineStandingsTable';
import { computeStandings } from './bracketUtils';
import { ROUND_LABELS } from '../detail/detail.constants';

interface Props {
  bracket: BracketResponse;
  multiCategory: boolean;
  categoryLabel: string;
  onPressMatch: (matchId: string) => void;
}

const GROUP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function GroupsThenEliminationBracketView({
  bracket,
  multiCategory,
  categoryLabel,
  onPressMatch,
}: Props) {
  const groupMatches = bracket.matches.filter(
    (m) => m.group !== null && m.group !== undefined && (m.round ?? 0) < 100,
  );
  const elimMatches = bracket.matches.filter(
    (m) => m.group === null || (m.round ?? 0) >= 100,
  );

  const groupsMap: Record<number, Match[]> = {};
  for (const m of groupMatches) {
    const g = m.group ?? 0;
    if (!groupsMap[g]) groupsMap[g] = [];
    groupsMap[g].push(m);
  }
  const sortedGroups = Object.entries(groupsMap).sort(([a], [b]) => Number(a) - Number(b));

  return (
    <View style={styles.section}>
      {multiCategory && <Text style={styles.catTitle}>{categoryLabel}</Text>}

      {sortedGroups.length > 0 && (
        <>
          <Text style={styles.groupTitle}>Fase de Grupos</Text>
          {sortedGroups.map(([groupKey, matches]) => {
            const groupNum = Number(groupKey);
            const letter = GROUP_LETTERS[groupNum] ?? `${groupNum + 1}`;
            const sortedMatches = [...matches].sort(
              (a, b) => a.round - b.round || a.position - b.position,
            );
            const standings = computeStandings(matches);

            return (
              <View key={groupNum} style={styles.groupSection}>
                <Text style={styles.groupLabel}>Grupo {letter}</Text>
                <InlineStandingsTable standings={standings} />
                {sortedMatches.map((m) => (
                  <BracketMatchCard key={m.id} match={m} onPress={onPressMatch} />
                ))}
              </View>
            );
          })}
        </>
      )}

      {elimMatches.length > 0 && (
        <>
          <Text style={[styles.groupTitle, { marginTop: spacing.md }]}>Eliminatória</Text>
          {(() => {
            const sorted = [...elimMatches].sort(
              (a, b) => a.round - b.round || a.position - b.position,
            );
            const rounds: Record<number, Match[]> = {};
            for (const m of sorted) {
              if (!rounds[m.round]) rounds[m.round] = [];
              rounds[m.round].push(m);
            }
            const sortedRounds = Object.entries(rounds).sort(([a], [b]) =>
              Number(a) - Number(b),
            );
            const displayMaxRound = sortedRounds.length;
            return sortedRounds.map(([roundKey, roundMatches], idx) => {
              const roundNum = Number(roundKey);
              const fromFinal = displayMaxRound - idx;
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
            });
          })()}
        </>
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
  groupSection: { marginBottom: spacing.lg },
  groupLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: 8,
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
