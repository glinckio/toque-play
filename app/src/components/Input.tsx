import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import { fonts } from '../theme/fonts';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helper?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: ViewStyle;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry,
  leftIcon,
  rightIcon,
  error,
  helper,
  accessibilityLabel,
  accessibilityHint,
  style,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={[styles.container, style]} accessible>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          !!leftIcon && { paddingLeft: spacing.md },
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        accessibilityRole="none"
      >
        {!!leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityValue={{ text: value }}
          importantForAutofill="yes"
          textContentType="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setShowPassword((prev) => !prev)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? 'Ocultar senha' : 'Mostrar senha'
            }
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textPlaceholder}
            />
          </TouchableOpacity>
        )}
        {!isPassword && rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      {!!error && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
      {!!helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.form.medium,
    fontSize: typography.sizes.input,
    color: colors.textDefault,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    height: 48,
  },
  inputFocused: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: colors.primary,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.form.regular,
    fontSize: typography.sizes.input,
    color: colors.text,
  },
  inputError: {
    borderBottomColor: colors.error,
  },
  leftIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.error,
  },
  helper: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
});
