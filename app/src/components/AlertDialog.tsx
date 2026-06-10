import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import ChevronButton from './ChevronButton';
import { useDialogStore, type DialogVariant } from '../stores/dialogStore';

const ICON_CONFIG: Record<DialogVariant, { name: string; color: string; bg: string }> = {
  success: { name: 'checkmark-circle', color: colors.success, bg: 'rgba(31,184,122,0.12)' },
  error: { name: 'close-circle', color: colors.error, bg: 'rgba(224,69,69,0.12)' },
  warning: { name: 'alert-circle', color: colors.warning, bg: 'rgba(240,160,48,0.12)' },
  info: { name: 'information-circle', color: colors.primary, bg: colors.primaryTint },
};

const BUTTON_VARIANT: Record<DialogVariant, 'primary' | 'danger' | 'success'> = {
  success: 'success',
  error: 'danger',
  warning: 'primary',
  info: 'primary',
};

export default function AlertDialog() {
  const { visible, config, hide } = useDialogStore();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  // Auto-close for success
  useEffect(() => {
    if (visible && config?.autoClose) {
      const t = setTimeout(hide, 2500);
      return () => clearTimeout(t);
    }
  }, [visible, config?.autoClose]);

  if (!config) return null;

  const iconCfg = ICON_CONFIG[config.variant];
  const btnVariant = config.confirmVariant ?? BUTTON_VARIANT[config.variant];
  const isConfirm = !!config.onConfirm;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={hide} />
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: iconCfg.bg }]}>
            <Ionicons name={iconCfg.name as any} size={32} color={iconCfg.color} />
          </View>

          {/* Title */}
          {config.title ? (
            <Text style={styles.title}>{config.title}</Text>
          ) : null}

          {/* Message */}
          <Text style={styles.message}>{config.message}</Text>

          {/* Buttons */}
          <View style={styles.buttons}>
            {isConfirm && (
              <ChevronButton variant="ghost" size="md" onPress={hide}>
                {config.cancelText ?? 'Cancelar'}
              </ChevronButton>
            )}
            <ChevronButton
              variant={isConfirm ? btnVariant : 'ghost'}
              size="md"
              onPress={() => {
                if (config.onConfirm) {
                  config.onConfirm();
                }
                hide();
              }}
            >
              {config.confirmText ?? 'OK'}
            </ChevronButton>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(20,10,30,0.5)',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xxl,
    paddingTop: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: 'rgba(20,10,30,0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.title,
    color: colors.text,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
});
