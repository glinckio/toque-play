import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

export function CaptainBadge({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.captainBadge}>
      <Ionicons name="ribbon" size={10} color={colors.primary} />
      <Text style={styles.captainBadgeText}>{compact ? 'CAP' : 'CAP'}</Text>
    </View>
  );
}

export function GuestBadge({ label = 'CONV' }: { label?: string }) {
  return (
    <View style={styles.guestBadge}>
      <Text style={styles.guestBadgeText}>{label}</Text>
    </View>
  );
}

export function PositionBadge({ label }: { label: string }) {
  return (
    <View style={styles.positionBadge}>
      <Text style={styles.positionBadgeText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  captainBadgeText: {
    fontFamily: fonts.text.bold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1.5,
  },
  guestBadge: {
    backgroundColor: 'rgba(240,160,48,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  guestBadgeText: {
    fontFamily: fonts.text.bold,
    fontSize: 11,
    color: colors.warning,
    letterSpacing: 1.5,
  },
  positionBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  positionBadgeText: {
    fontFamily: fonts.text.bold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
