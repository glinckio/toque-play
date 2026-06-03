import React from 'react';
import { Text as RNText, type TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type Variant = 'hero' | 'subtitle' | 'label' | 'body' | 'caption';

interface TextProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  style?: TextStyle;
}

const variants: Record<Variant, TextStyle> = {
  hero: {
    fontSize: typography.sizes.hero,
    lineHeight: typography.lineHeights.hero,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.normal,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.subtitle,
    lineHeight: typography.lineHeights.tight,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  body: {
    fontSize: typography.sizes.input,
    fontWeight: typography.weights.medium,
    color: colors.text,
  },
  caption: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
};

export default function Text({ children, variant = 'body', color, style }: TextProps) {
  return <RNText style={[variants[variant], !!color && { color }, style]}>{children}</RNText>;
}
