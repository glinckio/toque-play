import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'EmailConfirmation'>;

export default function EmailConfirmationScreen() {
  const navigation = useNavigation<Nav>();
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleResend = () => {
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000);
  };

  return (
    <AuthLayout>
      <HeroHeader
        title="VERIFIQUE SEU E-MAIL"
        subtitle="Enviamos um link de confirmação para o seu endereço de e-mail."
        watermark="EMAIL"
        rounded
      />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={48} color={colors.primary} />
        </View>

        <Text style={styles.subtitle}>
          Verifique também a caixa de spam.
        </Text>

        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => {}}
        >
          ABRIR E-MAIL
        </ChevronButton>

        <TouchableOpacity
          style={styles.resendRow}
          onPress={handleResend}
          disabled={resendCooldown}
          activeOpacity={0.7}
        >
          <Text style={styles.resendText}>
            {resendCooldown
              ? 'Link reenviado. Aguarde alguns instantes.'
              : 'Não recebeu? Enviar novamente'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Já confirmou?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
            Entrar
          </Text>
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  resendRow: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
  },
  resendText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    textAlign: 'center',
    fontFamily: fonts.text.medium,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: spacing.section,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: typography.sizes.body,
    fontFamily: fonts.text.regular,
  },
  footerLink: {
    color: colors.primary,
    fontFamily: fonts.text.bold,
  },
});
