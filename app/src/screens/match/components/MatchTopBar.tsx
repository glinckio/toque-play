import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';

interface Props {
  label?: string | null;
  isLive: boolean;
  isFinished: boolean;
  currentSetNum: number;
  onBack: () => void;
}

export function MatchTopBar({ label, isLive, isFinished, currentSetNum, onBack }: Props) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={20} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.topCenter}>
        <Text style={styles.matchLabel}>{label ?? 'PARTIDA'}</Text>
        {isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
        {isFinished && (
          <View style={styles.finishedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.finishedBadgeText}>ENCERRADA</Text>
          </View>
        )}
      </View>

      <View style={styles.setIndicator}>
        <Ionicons name="timer-outline" size={14} color={colors.textMuted} />
        <Text style={styles.setIndicatorText}>Set {currentSetNum}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCenter: { alignItems: 'center', gap: 4 },
  matchLabel: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.subtitle,
    color: colors.text,
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(224,69,69,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E04545' },
  liveText: {
    fontSize: 11,
    fontFamily: fonts.text.semiBold,
    color: '#E04545',
    letterSpacing: 1.5,
  },
  finishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(31,184,122,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  finishedBadgeText: {
    fontSize: 11,
    fontFamily: fonts.text.semiBold,
    color: colors.success,
    letterSpacing: 1,
  },
  setIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  setIndicatorText: {
    fontSize: 11,
    fontFamily: fonts.text.semiBold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
