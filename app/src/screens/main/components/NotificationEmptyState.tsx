import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { typography } from '../../../theme/typography';

export function NotificationEmptyState() {
  return (
    <View style={styles.emptySection}>
      <View style={styles.emptyIcon}>
        <Ionicons name="notifications-outline" size={40} color={colors.textPlaceholder} />
      </View>
      <Text style={styles.emptyTitle}>Tudo em dia</Text>
      <Text style={styles.emptyText}>Nenhuma notificação pendente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptySection: {
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
