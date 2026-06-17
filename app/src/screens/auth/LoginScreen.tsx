import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import ChevronButton from '../../components/ChevronButton';
import HeroHeader from '../../components/HeroHeader';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../stores/authStore';
import { loginSchema } from '../../schemas/auth';

type LoginNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const [email, setEmail] = useState('admin@toqueplay.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Dados inválidos');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.login(parsed.data);
      const is2fa = (
        r: typeof data,
      ): r is import('../../types/auth').TwoFactorRequiredResponse =>
        !!r && (r as any).twoFactorRequired === true;
      if (is2fa(data)) {
        navigation.navigate('TwoFactor', {
          temporaryToken: data.temporaryToken,
          email: parsed.data.email,
        });
        return;
      }
      useAuthStore.getState().setAuth(data);
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.message;
      const status = err?.response?.status;

      if (!err?.response) {
        setError('Sem conexão com o servidor.');
      } else if (code === 'EMAIL_NOT_VERIFIED') {
        navigation.navigate('VerifyEmail', { email });
      } else if (code === 'EMAIL_NOT_FOUND') {
        setError('E-mail não encontrado');
      } else if (code === 'INVALID_PASSWORD') {
        setError('Senha incorreta');
      } else {
        setError(`${msg ?? 'Erro'} (${status ?? '?'})`);
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = email.length > 0 && password.length > 0;

  return (
    <AuthLayout>
      <HeroHeader
        title="Bem-vindo(a)"
        subtitle="Entre para acompanhar seus torneios e amistosos"
        watermark="Entrar"
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

        <View style={{ marginTop: spacing.lg }}>
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            leftIcon={<Ionicons name="lock-closed-outline" size={16} color={colors.textPlaceholder} />}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          hitSlop={{ top: 10, bottom: 10 }}
        >
          <Text style={styles.forgotLink}>Esqueci minha senha</Text>
        </TouchableOpacity>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonRow}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            disabled={!isValid || loading}
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </ChevronButton>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google */}
        <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
          <Ionicons name="logo-google" size={20} color={colors.text} />
          <Text style={styles.socialBtnText}>Continuar com Google</Text>
        </TouchableOpacity>

        {/* Guest */}
        <TouchableOpacity style={styles.guestBtn} activeOpacity={0.7}>
          <Text style={styles.guestText}>Entrar como visitante</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Não tem conta?{' '}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
            Criar conta
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
    gap: 0,
  },
  forgotLink: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },
  buttonRow: {
    marginTop: spacing.xl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ECECF0',
  },
  dividerText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textPlaceholder,
    marginHorizontal: spacing.md,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECF0',
    borderRadius: 8,
  },
  socialBtnText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.text,
  },
  guestBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  guestText: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.button,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
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
