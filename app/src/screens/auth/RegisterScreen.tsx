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
import ChevronButton from '../../components/ChevronButton';
import HeroHeader from '../../components/HeroHeader';
import { authService } from '../../services/auth';

type RegisterNav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.register({ name, email, password, confirmPassword });
      navigation.navigate('VerifyEmail', { email });
    } catch (err: any) {
      const code = err?.response?.data?.code;
      if (code === 'EMAIL_ALREADY_EXISTS') {
        setError('E-mail já cadastrado');
      } else if (code === 'PASSWORDS_DO_NOT_MATCH') {
        setError('As senhas não coincidem');
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
    password === confirmPassword;

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
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
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
