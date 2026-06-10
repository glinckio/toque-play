import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import StatusBadge from '../StatusBadge';
import type { Tournament } from '../../types/tournament';

interface Props {
  tournament: Tournament;
  onPress?: () => void;
}

function fmtShortDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function TournamentCard({ tournament, onPress }: Props) {
  const stage = tournament.stages?.[0];
  const participants = tournament.registrationCount ?? tournament._count?.registrations ?? 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} style={styles.card}>
      {/* Cover */}
      <View style={styles.cover}>
        <View style={styles.coverGradient} />
        <View style={styles.badgePos}>
          <StatusBadge status={tournament.status} size="sm" />
        </View>
        <View style={styles.coverText}>
          <Text style={styles.coverTitle} numberOfLines={2}>
            {tournament.name}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
            <Text style={styles.infoText}>{fmtShortDate(stage?.date)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={13} color={colors.textMuted} />
            <Text style={styles.infoText}>
              {stage?.city ?? ''}{stage?.state ? `/${stage.state}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.participants}>
          <Ionicons name="people-outline" size={13} color={colors.primary} />
          <Text style={styles.participantsText}>{participants}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cover: {
    height: 120,
    backgroundColor: colors.primary,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,30,0.4)',
  },
  badgePos: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  coverText: {
    padding: 12,
  },
  coverTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
});
