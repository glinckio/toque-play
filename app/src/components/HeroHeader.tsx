import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { fonts } from '../theme/fonts';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { opacity } from '../theme/glow';

interface Props {
  title: string;
  subtitle?: string;
  watermark?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  variant?: 'primary' | 'dark';
  rounded?: boolean;
  compact?: boolean;
  closeIcon?: boolean;
}

export default function HeroHeader({
  title,
  subtitle,
  watermark,
  onBack,
  right,
  variant = 'primary',
  rounded = true,
  compact = false,
  closeIcon = false,
}: Props) {
  const bg = variant === 'primary' ? colors.primary : colors.dark;
  const bgEnd = variant === 'primary' ? colors.primaryDark : colors.darkSecondary;

  return (
    <View style={[styles.container, rounded && styles.roundedBottom]}>
      {/* Gradient simulation with two layers */}
      <View style={[styles.gradientBg, { backgroundColor: bgEnd }]} />
      <View style={[styles.gradientFg, { backgroundColor: bg }]} />

      {/* Watermark */}
      {!compact && watermark && (
        <Text style={styles.watermark} numberOfLines={1}>
          {watermark}
        </Text>
      )}

      {/* Top bar */}
      <View style={[styles.topBar, compact && styles.topBarCompact]}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name={closeIcon ? 'close' : 'chevron-back'} size={closeIcon ? 22 : 20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
        {right}
      </View>

      {/* Title area */}
      <View style={[styles.titleArea, compact && styles.titleAreaCompact]}>
        <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  roundedBottom: {
    borderBottomLeftRadius: radius.section,
    borderBottomRightRadius: radius.section,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientFg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  watermark: {
    position: 'absolute',
    right: -20,
    top: 46,
    fontFamily: fonts.title.regular,
    fontSize: 128,
    color: '#FFFFFF',
    opacity: opacity.watermark,
    letterSpacing: 2,
    lineHeight: 128,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 77,
    paddingBottom: spacing.md,
  },
  topBarCompact: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 36,
  },
  titleArea: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: 36,
  },
  titleAreaCompact: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.display,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.medium,
  },
  titleCompact: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.title,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.medium,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.input,
    color: 'rgba(255,255,255,0.78)',
  },
});
