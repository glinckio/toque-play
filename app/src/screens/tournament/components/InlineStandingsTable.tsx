import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';

export interface StandingEntry {
  id: string;
  name: string;
  wins: number;
  played: number;
  pointsScored: number;
}

interface Props {
  standings: StandingEntry[];
  title?: string;
}

export function InlineStandingsTable({ standings, title }: Props) {
  if (standings.length === 0) return null;
  return (
    <View style={styles.standingsCard}>
      {title ? <Text style={styles.standingsTitle}>{title}</Text> : null}
      <View style={styles.standingsHeader}>
        <Text style={styles.standingsHeaderPos}>#</Text>
        <Text style={styles.standingsHeaderTeam}>Time</Text>
        <Text style={styles.standingsHeaderStat}>J</Text>
        <Text style={styles.standingsHeaderStat}>V</Text>
        <Text style={styles.standingsHeaderStat}>Pts</Text>
      </View>
      {standings.map((entry, i) => (
        <View
          key={entry.id}
          style={[
            styles.standingsRow,
            i < standings.length - 1 && styles.standingsRowBorder,
            i === 0 && styles.standingsLeaderRow,
          ]}
        >
          <Text style={[styles.standingsPos, i === 0 && styles.standingsLeaderText]}>
            {i + 1}
          </Text>
          <Text
            style={[styles.standingsTeamName, i === 0 && styles.standingsLeaderText]}
            numberOfLines={1}
          >
            {entry.name}
          </Text>
          <Text style={[styles.standingsStat, i === 0 && styles.standingsLeaderText]}>
            {entry.played}
          </Text>
          <Text style={[styles.standingsStat, i === 0 && styles.standingsLeaderText]}>
            {entry.wins}
          </Text>
          <Text style={[styles.standingsStatBold, i === 0 && { color: '#0E7A4A' }]}>
            {entry.pointsScored}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  standingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  standingsTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.md,
  },
  standingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECF0',
    marginBottom: spacing.xs,
  },
  standingsHeaderPos: {
    width: 28,
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  standingsHeaderTeam: {
    flex: 1,
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  standingsHeaderStat: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  standingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  standingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFFA',
  },
  standingsPos: {
    width: 28,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.input,
    color: colors.primary,
  },
  standingsTeamName: {
    flex: 1,
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.text,
  },
  standingsStat: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
  },
  standingsStatBold: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.input,
    color: colors.primary,
  },
  standingsLeaderRow: {
    backgroundColor: 'rgba(31,184,122,0.1)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
  },
  standingsLeaderText: {
    color: '#0E7A4A',
  },
});
