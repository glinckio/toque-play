import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';

interface Props {
  memberCount: number;
}

export function TeamStatsCard({ memberCount }: Props) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{memberCount}</Text>
        <Text style={styles.statLabel}>Membros</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>0</Text>
        <Text style={styles.statLabel}>Vitórias</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>0%</Text>
        <Text style={styles.statLabel}>Aproveitamento</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.title,
    color: colors.text,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: 4,
  },
  statDivider: { width: 1, backgroundColor: '#F4EFFA' },
});
