import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
      <LinearGradient
        colors={['rgba(109,46,192,0.08)', 'transparent']}
        locations={[0.4, 1]}
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

            <Text style={styles.formTitle}>CRIAR CONTA</Text>
            <Text style={styles.formSubtitle}>
              Junte-se à elite. Comece agora.
            </Text>

            <Input
              label="NOME"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              autoCapitalize="words"
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={colors.textMuted}
                />
              }
            />

            <View style={{ marginTop: spacing.lg }}>
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
            </View>

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

            <View style={{ marginTop: spacing.lg }}>
              <Input
                label="CONFIRMAR SENHA"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                leftIcon={
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={colors.textMuted}
                  />
                }
                error={
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? 'As senhas não coincidem'
                    : undefined
                }
              />
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title={loading ? 'CRIANDO...' : 'CRIAR CONTA'}
              onPress={handleRegister}
              disabled={!isValid || loading}
              style={{ marginTop: spacing.xl }}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
              <Ionicons name="logo-google" size={20} color={colors.text} />
              <Text style={styles.socialBtnText}>Cadastrar com Google</Text>
            </TouchableOpacity>

            {/* Guest */}
            <TouchableOpacity style={styles.guestBtn} activeOpacity={0.7}>
              <Ionicons name="eye-outline" size={16} color={colors.textMuted} />
              <Text style={styles.guestText}>Explorar como visitante</Text>
            </TouchableOpacity>
          </View>

          {/* ─── Footer ───────────────────────── */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Já tem uma conta?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.navigate('Login')}
              >
                Entrar
              </Text>
            </Text>
          </View>
        </View>
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

  errorText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },

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
