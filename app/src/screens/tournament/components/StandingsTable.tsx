import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RankingResponse } from '../../../types/match';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';
import { radius } from '../../../theme/radius';

interface Props {
  ranking: RankingResponse;
}

export default function StandingsTable({ ranking }: Props) {
  if (ranking.ranking.length === 0) {
    return (
      <View style={styles.empty}>
        <View style={styles.emptyIcon}>
          <Ionicons name="podium-outline" size={40} color={colors.textPlaceholder} />
        </View>
        <Text style={styles.emptyText}>Ranking não disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.cellPos, styles.headerText]}>#</Text>
        <Text style={[styles.cell, styles.cellName, styles.headerText]}>TIME</Text>
        <Text style={[styles.cell, styles.cellStat, styles.headerText]}>V</Text>
        <Text style={[styles.cell, styles.cellStat, styles.headerText]}>PTS</Text>
      </View>

      {ranking.ranking.map((entry) => {
        const isTop3 = entry.position <= 3;
        return (
          <View key={entry.team.id} style={[styles.row, isTop3 && styles.topRow]}>
            <Text style={[styles.cell, styles.cellPos, isTop3 && styles.topText]}>
              {entry.position}
            </Text>
            <Text style={[styles.cell, styles.cellName, isTop3 && styles.topText]} numberOfLines={1}>
              {entry.team.name}
            </Text>
            <Text style={[styles.cell, styles.cellStat, isTop3 && styles.topText]}>
              {entry.wins}
            </Text>
            <Text style={[styles.cell, styles.cellStat, styles.cellBold, isTop3 && styles.topText]}>
              {entry.points}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  headerText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F4EFFA',
  },
  topRow: { backgroundColor: colors.primaryTint },
  topText: { color: colors.primary, fontFamily: fonts.text.semiBold },
  cell: { fontSize: typography.sizes.input, fontFamily: fonts.text.regular, color: colors.textSecondary },
  cellPos: { width: 36, textAlign: 'center' },
  cellName: { flex: 1 },
  cellStat: { width: 48, textAlign: 'center' },
  cellBold: { fontFamily: fonts.text.bold },
  empty: { alignItems: 'center', marginTop: 60, gap: spacing.md },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyText: { fontSize: typography.sizes.input, fontFamily: fonts.text.regular, color: colors.textMuted },
});
