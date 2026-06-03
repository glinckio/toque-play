import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RankingResponse } from '../../../types/match';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';

interface Props {
  ranking: RankingResponse;
}

export default function StandingsTable({ ranking }: Props) {
  if (ranking.ranking.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="podium-outline" size={40} color={colors.textMuted} />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  headerText: {
    fontSize: 9,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  topRow: { backgroundColor: 'rgba(109,46,192,0.08)' },
  topText: { color: colors.primaryGlow, fontFamily: fonts.text.semiBold },
  cell: { fontSize: 13, fontFamily: fonts.text.regular, color: colors.textSecondary },
  cellPos: { width: 36, textAlign: 'center' },
  cellName: { flex: 1 },
  cellStat: { width: 48, textAlign: 'center' },
  cellBold: { fontFamily: fonts.text.bold },
  empty: { alignItems: 'center', marginTop: 60, gap: spacing.md },
  emptyText: { fontSize: 14, fontFamily: fonts.text.regular, color: colors.textMuted },
});
