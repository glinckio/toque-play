import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import type { Friendly } from '../../../types/friendly';

interface Props {
  friendly: Friendly;
  nameA: string;
  nameB: string;
}

export function CompletedMatchInfo({ friendly, nameA, nameB }: Props) {
  const sets = friendly.match?.sets ?? [];
  const wonA = sets.filter((set) => set.scoreA > set.scoreB).length;
  const wonB = sets.filter((set) => set.scoreB > set.scoreA).length;
  const winnerId = friendly.match?.winnerId;
  const winnerIsA = winnerId && winnerId === friendly.requesterTeamId;

  return (
    <>
      {winnerId && (
        <View style={styles.winnerBadge}>
          <Ionicons name="trophy" size={18} color="#FFD700" />
          <Text style={styles.winnerText}>
            Vencedor: {winnerIsA ? nameA : nameB}
          </Text>
        </View>
      )}

      {sets.length > 0 && (
        <View style={styles.setsCard}>
          <Text style={styles.setsTitle}>SETS</Text>
          <View style={styles.setsSummaryRow}>
            <View style={styles.setsSummaryCol}>
              <Text style={styles.setsSummaryName} numberOfLines={1}>{nameA}</Text>
              <Text style={[styles.setsSummaryCount, wonA > wonB && styles.setsWinner]}>{wonA}</Text>
            </View>
            <Text style={styles.setsDivider}>×</Text>
            <View style={styles.setsSummaryCol}>
              <Text style={styles.setsSummaryName} numberOfLines={1}>{nameB}</Text>
              <Text style={[styles.setsSummaryCount, wonB > wonA && styles.setsWinner]}>{wonB}</Text>
            </View>
          </View>
          {sets.map((set) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={[styles.setScore, set.scoreA > set.scoreB && styles.setScoreWin]}>
                {set.scoreA}
              </Text>
              <Text style={styles.setLabel}>Set {set.setNumber}</Text>
              <Text style={[styles.setScore, set.scoreB > set.scoreA && styles.setScoreWin]}>
                {set.scoreB}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  winnerText: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.bold,
    color: '#FFD700',
  },
  setsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  setsTitle: {
    fontSize: typography.sizes.heading,
    fontFamily: fonts.title.regular,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.medium,
  },
  setsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.lg,
  },
  setsSummaryCol: { alignItems: 'center', flex: 1 },
  setsSummaryName: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    textAlign: 'center',
  },
  setsSummaryCount: {
    fontSize: typography.sizes.hero,
    fontFamily: fonts.title.regular,
    color: colors.textMuted,
  },
  setsWinner: { color: colors.primary },
  setsDivider: {
    fontSize: typography.sizes.display,
    fontFamily: fonts.title.regular,
    color: colors.textMuted,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: 4,
  },
  setScore: {
    fontSize: typography.sizes.subtitle,
    fontFamily: fonts.title.regular,
    color: colors.textMuted,
    minWidth: 30,
    textAlign: 'center',
  },
  setScoreWin: { color: colors.primary },
  setLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.medium,
    color: colors.textSecondary,
  },
});
