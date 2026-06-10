import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import StatusBadge from '../StatusBadge';
import type { Friendly } from '../../types/friendly';

interface Props {
  friendly: Friendly;
  onPress?: () => void;
}

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function FriendlyCard({ friendly, onPress }: Props) {
  const teamA = friendly.requesterTeam?.name ?? friendly.requester?.name ?? 'Solicitante';
  const teamB = friendly.challengedTeam?.name ?? friendly.challenged?.name ?? 'Aguardando';
  const modalityLabel = friendly.modality === 'BEACH' ? 'Praia' : 'Quadra';
  const formatLabel = friendly.categoryFormat ?? '';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <StatusBadge status={friendly.status} size="sm" />
        <Text style={styles.headerRight}>
          {modalityLabel} · {formatLabel}
        </Text>
      </View>

      {/* VS section */}
      <View style={styles.vsSection}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName} numberOfLines={1}>{teamA}</Text>
          <Text style={styles.teamRole}>Solicitante</Text>
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={[styles.teamInfo, { alignItems: 'flex-end' }]}>
          <Text style={styles.teamName} numberOfLines={1}>{teamB}</Text>
          <Text style={styles.teamRole}>Desafiado</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={styles.footerText}>
            {fmtDate(friendly.date)}{friendly.startTime ? ` · ${friendly.startTime}` : ''}
          </Text>
        </View>
        {friendly.city && (
          <View style={styles.footerItem}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.footerText}>{friendly.city}</Text>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryTint,
  },
  headerRight: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  vsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  teamInfo: {
    flex: 1,
    minWidth: 0,
  },
  teamName: {
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  teamRole: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textPlaceholder,
    marginTop: 2,
  },
  vs: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.subtitle,
    color: colors.primary,
    paddingHorizontal: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.background,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
});
