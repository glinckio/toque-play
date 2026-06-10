import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  icon,
  fullWidth,
  size = 'lg',
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          variant === 'secondary' && styles.textSecondary,
          variant === 'outline' && styles.textOutline,
          variant === 'ghost' && styles.textGhost,
          variant === 'danger' && styles.textDanger,
          !!icon && { marginLeft: spacing.sm },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    height: 28,
  },
  md: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    height: 40,
  },
  lg: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    height: 48,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECF0',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.primaryTint,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.disabled,
    opacity: 1,
  },
  text: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.button,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.medium,
  },
  textSecondary: {
    color: colors.text,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.primary,
  },
  textDanger: {
    color: '#FFFFFF',
  },
});
