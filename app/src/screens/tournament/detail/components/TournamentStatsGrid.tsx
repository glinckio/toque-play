import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';

interface Props {
  modalityLabel: string;
  formatLabel: string;
  categoryCount: number;
}

export function TournamentStatsGrid({
  modalityLabel,
  formatLabel,
  categoryCount,
}: Props) {
  return (
    <View style={styles.statsWrap}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{modalityLabel}</Text>
          <Text style={styles.statLabel}>Modalidade</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatLabel}</Text>
          <Text style={styles.statLabel}>Formato</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{String(categoryCount)}</Text>
          <Text style={styles.statLabel}>Categorias</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsWrap: {
    paddingHorizontal: spacing.xl,
    marginTop: -16,
    position: 'relative',
    zIndex: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.text.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ECECF0',
    marginVertical: 4,
  },
});
