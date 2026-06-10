import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import type { Team } from '../../types/team';

interface Props {
  team: Team;
  wins?: number;
  losses?: number;
  onPress?: () => void;
}

export default function TeamCard({ team, wins = 0, losses = 0, onPress }: Props) {
  const memberCount = team.members?.length ?? team._count?.members ?? 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Ionicons name="volleyball-outline" size={24} color="#FFFFFF" />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{team.name}</Text>
        <Text style={styles.meta}>
          {team.sport === 'BEACH' ? 'Praia' : 'Quadra'} · {memberCount} atletas
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={styles.statWin}>{wins}</Text>
          <Text style={styles.statLabel}>V</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLoss}>{losses}</Text>
          <Text style={[styles.statLabel, { fontSize: 10 }]}>D</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontFamily: fonts.text.bold,
    fontSize: 15,
    color: colors.text,
  },
  meta: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  stats: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statWin: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.success,
    lineHeight: 1,
  },
  statLoss: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.error,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: colors.textPlaceholder,
  },
});
