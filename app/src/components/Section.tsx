import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props {
  title: string;
  cta?: string;
  onCta?: () => void;
  children: React.ReactNode;
}

export default function Section({ title, cta, onCta, children }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {cta && onCta && (
          <TouchableOpacity onPress={onCta} activeOpacity={0.7} style={styles.ctaBtn}>
            <Text style={styles.cta}>{cta}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cta: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
});
