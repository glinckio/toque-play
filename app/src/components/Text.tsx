import React from 'react';
import { Text as RNText, type TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

type Variant = 'title' | 'subtitle' | 'label' | 'body' | 'caption';

interface TextProps {
  children: React.ReactNode;
  variant?: Variant;
  color?: string;
  style?: TextStyle;
}

const variants: Record<Variant, TextStyle> = {
  title: {
    fontSize: typography.sizes.title,
    fontFamily: fonts.title.regular,
    lineHeight: typography.sizes.title * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.normal,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.subtitle,
    fontFamily: fonts.text.semiBold,
    lineHeight: typography.sizes.subtitle * typography.lineHeights.tight,
    color: colors.textSecondary,
  },
  label: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  body: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.medium,
    color: colors.text,
  },
  caption: {
    fontSize: typography.sizes.sm,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
  },
};

export default function Text({ children, variant = 'body', color, style }: TextProps) {
  return <RNText style={[variants[variant], !!color && { color }, style]}>{children}</RNText>;
}
