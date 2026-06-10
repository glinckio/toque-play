import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import Svg, { Path } from 'react-native-svg';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  children: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const fills: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: colors.primary, text: '#FFFFFF' },
  secondary: { bg: colors.dark, text: '#FFFFFF' },
  ghost: { bg: colors.primaryTint, text: colors.primary },
  danger: { bg: colors.error, text: '#FFFFFF' },
  success: { bg: colors.success, text: '#FFFFFF' },
  dark: { bg: colors.darkSecondary, text: '#FFFFFF' },
};

const sizes: Record<Size, { h: number; px: number; fs: number; cap: number }> = {
  sm: { h: 28, px: 12, fs: 12, cap: 7 },
  md: { h: 40, px: 16, fs: 14, cap: 10 },
  lg: { h: 48, px: 20, fs: 16, cap: 12 },
};

export default function ChevronButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth,
  disabled,
  icon,
}: Props) {
  const c = disabled ? { bg: colors.disabled, text: colors.disabledText } : fills[variant];
  const s = sizes[size];
  const cap = s.cap;
  const h = s.h;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.container, fullWidth && styles.fullWidth]}
    >
      {/* Left chevron */}
      <Svg width={cap} height={h} viewBox={`0 0 ${cap} ${h}`} preserveAspectRatio="none">
        <Path d={`M${cap} 0 L0 ${h / 2} L${cap} ${h} Z`} fill={c.bg} />
      </Svg>

      {/* Center */}
      <View style={[styles.center, { backgroundColor: c.bg, height: h, paddingHorizontal: s.px }, fullWidth && { flex: 1 }]}>
        {icon}
        <Text
          style={{
            fontFamily: fonts.title.regular,
            fontSize: s.fs,
            color: c.text,
            letterSpacing: typography.letterSpacing.medium,
            ...(!!icon && { marginLeft: 8 }),
          }}
        >
          {children}
        </Text>
      </View>

      {/* Right chevron */}
      <Svg width={cap} height={h} viewBox={`0 0 ${cap} ${h}`} preserveAspectRatio="none">
        <Path d={`M0 0 L${cap} ${h / 2} L0 ${h} Z`} fill={c.bg} />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  fullWidth: {
    width: '100%',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
