import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../stores/authStore';

type LoginNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginNav>();
  const [email, setEmail] = useState('linck@toqueplay.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      useAuthStore.getState().setAuth(data);
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.message;
      const status = err?.response?.status;
      const errUrl = err?.config?.url;
      const errBase = err?.config?.baseURL;

      // Debug: show real error info
      if (!err?.response) {
        setError(`Sem conexão com o servidor. Base: ${errBase ?? 'indefinida'}`);
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
      <ImageBackground
        source={require('../../../assets/img/ChatGPT Image 27 de mai. de 2026, 21_15_28.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Dark atmospheric overlay */}
        <LinearGradient
          colors={[
            'rgba(5,6,10,0.55)',
            'rgba(5,6,10,0.7)',
            'rgba(5,6,10,0.92)',
            'rgba(5,6,10,1)',
          ]}
          locations={[0, 0.25, 0.55, 0.8]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Purple accent glow top */}
        <LinearGradient
          colors={['rgba(109,46,192,0.15)', 'transparent']}
          locations={[0.3, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          {/* ─── Brand ─────────────────────────── */}
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>TOQUEPLAY</Text>
            <Text style={styles.tagline}>
              SEU JOGO. SUA EQUIPE.{' '}
              <Text style={styles.taglineAccent}>SUA HISTÓRIA.</Text>
            </Text>
          </View>

          {/* ─── Form ──────────────────────────── */}
          <View style={styles.formBlock}>
            <View style={styles.formGlowBar} />

            <Text style={styles.formTitle}>ENTRAR</Text>
            <Text style={styles.formSubtitle}>
              Acesse sua conta para continuar.
            </Text>

            <Input
              label="E-MAIL"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={colors.textMuted}
                />
              }
            />

            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="SENHA"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                leftIcon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={colors.textMuted}
                  />
                }
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={{ top: 10, bottom: 10, left: 0, right: 0 }}
            >
              <Text style={styles.forgotLink}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title={loading ? 'ENTRANDO...' : 'ENTRAR'}
              onPress={handleLogin}
              disabled={!isValid || loading}
              style={{ marginTop: spacing.xl }}
            />

            {/* Divider */}
            {/* <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View> */}

            {/* Google */}
            {/* <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Ionicons name="logo-google" size={20} color={colors.text} />
              <Text style={styles.socialBtnText}>Entrar com Google</Text>
            </TouchableOpacity> */}

            {/* Guest */}
            {/* <TouchableOpacity style={styles.guestBtn} activeOpacity={0.7}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <Text style={styles.guestText}>Explorar como visitante</Text>
            </TouchableOpacity> */}
          </View>

          {/* ─── Footer ───────────────────────── */}
          {/* <View style={styles.footer}>
            <Text style={styles.footerText}>
              Não tem uma conta?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.navigate('Register')}
              >
                Cadastre-se
              </Text>
            </Text>
          </View> */}
        </View>
      </ImageBackground>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },

  // ─── Brand ──────────────────────────────────────
  brandBlock: {
    marginBottom: spacing.hero,
  },
  brandName: {
    fontFamily: fonts.title.display,
    fontSize: 56,
    lineHeight: 58,
    color: colors.text,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 14,
    letterSpacing: 3,
    lineHeight: 20,
    color: colors.textMuted,
    fontFamily: fonts.body.semiBold,
    marginTop: spacing.xs,
  },
  taglineAccent: {
    color: colors.primaryGlow,
  },

  // ─── Form ───────────────────────────────────────
  formBlock: {
    backgroundColor: 'rgba(10,10,16,0.75)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.12)',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl - 4,
    overflow: 'hidden',
  },
  formGlowBar: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 2,
    backgroundColor: colors.primaryGlow,
    borderRadius: 2,
    shadowColor: colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  formTitle: {
    fontFamily: fonts.title.display,
    fontSize: 42,
    lineHeight: 44,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 4,
    marginTop: spacing.md,
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
    fontFamily: fonts.text.regular,
  },

  forgotLink: {
    color: colors.primaryGlow,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: spacing.md,
    fontFamily: fonts.text.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },

  // ─── Divider ────────────────────────────────────
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
    fontFamily: fonts.text.regular,
  },

  // ─── Social ─────────────────────────────────────
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  socialBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.text.semiBold,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  guestText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.text.regular,
  },

  // ─── Footer ─────────────────────────────────────
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: fonts.text.regular,
  },
  footerLink: {
    color: colors.primaryGlow,
    fontWeight: '600',
    fontFamily: fonts.text.semiBold,
  },
});
