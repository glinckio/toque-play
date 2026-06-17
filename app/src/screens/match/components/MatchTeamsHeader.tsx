import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';
import TeamAvatar from '../../../components/TeamAvatar';

interface Props {
  nameA: string;
  nameB: string;
  avatarA?: string | null;
  avatarB?: string | null;
  setsWonA: number;
  setsWonB: number;
}

export function MatchTeamsHeader({
  nameA,
  nameB,
  avatarA,
  avatarB,
  setsWonA,
  setsWonB,
}: Props) {
  return (
    <View style={styles.teamsHeader}>
      <View style={styles.teamHeaderCol}>
        <TeamAvatar avatarUrl={avatarA} name={nameA} size={48} />
        <Text style={styles.teamHeaderName} numberOfLines={1}>{nameA}</Text>
        <Text style={styles.setsWon}>Sets: {setsWonA}</Text>
      </View>
      <View style={styles.vsCol}>
        <Text style={styles.vsText}>VS</Text>
      </View>
      <View style={[styles.teamHeaderCol, { alignItems: 'flex-end' }]}>
        <TeamAvatar avatarUrl={avatarB} name={nameB} size={48} />
        <Text style={[styles.teamHeaderName, { textAlign: 'right' }]} numberOfLines={1}>
          {nameB}
        </Text>
        <Text style={styles.setsWon}>Sets: {setsWonB}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teamsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  teamHeaderCol: { flex: 1, gap: spacing.xs },
  teamHeaderName: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: 0.4,
  },
  setsWon: { fontSize: 11, fontFamily: fonts.text.medium, color: colors.textMuted },
  vsCol: { paddingHorizontal: spacing.md },
  vsText: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.subtitle,
    color: colors.textMuted,
  },
});
