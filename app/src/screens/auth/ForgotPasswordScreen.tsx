import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';
import { authService } from '../../services/auth';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <HeroHeader title="E-MAIL ENVIADO" watermark="OK" rounded />
        <View style={styles.sentContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.sentTitle}>Verifique sua caixa de entrada</Text>
          <Text style={styles.sentSubtitle}>
            Siga as instruções para redefinir sua senha.
          </Text>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Login')}
          >
            VOLTAR AO LOGIN
          </ChevronButton>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <HeroHeader
        title="RECUPERAR SENHA"
        subtitle="Informe seu e-mail e enviaremos um link para redefinir sua senha."
        watermark="SENHA"
        rounded
      />

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          leftIcon={<Ionicons name="mail-outline" size={16} color={colors.textPlaceholder} />}
        />

        <View style={styles.buttonRow}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSend}
            disabled={email.length === 0 || loading}
          >
            {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
          </ChevronButton>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Lembrou a senha?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
            Entrar
          </Text>
        </Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.section,
  },
  buttonRow: {
    marginTop: spacing.xl,
  },
  sentContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.hero,
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  sentTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sentSubtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: spacing.xl,
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
