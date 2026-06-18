import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Pressable } from 'react-native';
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
import ChevronButton from '../../components/ChevronButton';
import HeroHeader from '../../components/HeroHeader';
import { authService } from '../../services/auth';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '../../config/legal-urls';

type RegisterNav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

function ConsentCheckbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: React.ReactNode;
}) {
  return (
    <Pressable onPress={onToggle} style={styles.consentRow} accessibilityRole="checkbox">
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="check" size={14} color="#fff" />}
      </View>
      <Text style={styles.consentLabel}>{label}</Text>
    </Pressable>
  );
}

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // LGPD consents
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [optNotifications, setOptNotifications] = useState(false);
  const [optLocation, setOptLocation] = useState(false);
  const [optMarketing, setOptMarketing] = useState(false);

  const handleRegister = async () => {
    if (!acceptedTerms) {
      setError('Você precisa aceitar os Termos e a Política de Privacidade para continuar.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.register({
        name,
        email,
        password,
        confirmPassword,
        consent: true,
        consents: {
          notificationsPush: optNotifications,
          locationDiscovery: optLocation,
          marketingEmail: optMarketing,
        },
      });
      navigation.navigate('VerifyEmail', { email });
    } catch (err: any) {
      const code = err?.response?.data?.code;
      if (code === 'EMAIL_ALREADY_EXISTS') {
        setError('E-mail já cadastrado');
      } else if (code === 'PASSWORDS_DO_NOT_MATCH') {
        setError('As senhas não coincidem');
      } else if (code === 'CONSENT_REQUIRED') {
        setError('Consentimento aos Termos é obrigatório (LGPD).');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    name.length > 0 &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    acceptedTerms;

  return (
    <AuthLayout>
      <HeroHeader
        title="Crie sua conta"
        subtitle="Monte seu time e participe de torneios e amistosos"
        watermark="Criar"
        rounded
      />

      <View style={styles.form}>
        <Input
          label="Nome completo"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          autoCapitalize="words"
          leftIcon={<Ionicons name="person-outline" size={16} color={colors.textPlaceholder} />}
        />

        <View style={{ marginTop: spacing.lg }}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={16} color={colors.textPlaceholder} />}
          />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            leftIcon={<Ionicons name="lock-closed-outline" size={16} color={colors.textPlaceholder} />}
          />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <Input
            label="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repita a senha"
            secureTextEntry
            leftIcon={<Ionicons name="lock-closed-outline" size={16} color={colors.textPlaceholder} />}
            error={
              confirmPassword.length > 0 && password !== confirmPassword
                ? 'As senhas não coincidem'
                : undefined
            }
          />
        </View>

        <View style={styles.consentsBlock}>
          <ConsentCheckbox
            checked={acceptedTerms}
            onToggle={() => setAcceptedTerms((v) => !v)}
            label={
              <>
                Li e aceito os{' '}
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL(TERMS_OF_USE_URL)}
                >
                  Termos de Uso
                </Text>{' '}
                e a{' '}
                <Text
                  style={styles.link}
                  onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
                >
                  Política de Privacidade
                </Text>
                .
              </>
            }
          />

          <ConsentCheckbox
            checked={optNotifications}
            onToggle={() => setOptNotifications((v) => !v)}
            label="Quero receber notificações push sobre meus jogos e torneios (opcional)."
          />

          <ConsentCheckbox
            checked={optLocation}
            onToggle={() => setOptLocation((v) => !v)}
            label="Permitir usar minha localização para descobrir torneios próximos (opcional)."
          />

          <ConsentCheckbox
            checked={optMarketing}
            onToggle={() => setOptMarketing((v) => !v)}
            label="Quero receber emails promocionais e novidades (opcional)."
          />
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={{ marginTop: spacing.xl }}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleRegister}
            disabled={!isValid || loading}
          >
            {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </ChevronButton>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Já tem conta?{' '}
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
  },
  consentsBlock: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  consentLabel: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontFamily: fonts.text.regular,
    lineHeight: 20,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontFamily: fonts.text.bold,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
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
