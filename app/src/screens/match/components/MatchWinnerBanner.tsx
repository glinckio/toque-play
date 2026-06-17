import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';

interface Props {
  winnerName: string;
}

export function MatchWinnerBanner({ winnerName }: Props) {
  return (
    <View style={styles.winnerBanner}>
      <Ionicons name="trophy" size={24} color={colors.primaryLight} />
      <View>
        <Text style={styles.winnerLabel}>VENCEDOR</Text>
        <Text style={styles.winnerName}>{winnerName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: 'rgba(109,46,192,0.08)',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.2)',
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  winnerLabel: {
    fontSize: 11,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  winnerName: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
