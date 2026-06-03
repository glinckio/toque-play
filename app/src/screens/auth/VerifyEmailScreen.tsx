import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import { authService } from '../../services/auth';
import { useAuthStore } from '../../stores/authStore';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type Route = RouteProp<AuthStackParamList, 'VerifyEmail'>;

const CODE_LENGTH = 6;

export default function VerifyEmailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const email = route.params?.email ?? '';

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    // Auto-advance
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    const fullCode = newCode.join('');
    if (fullCode.length === CODE_LENGTH && !newCode.includes('')) {
      handleVerify(fullCode);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleVerify = async (fullCode?: string) => {
    const finalCode = fullCode ?? code.join('');
    if (finalCode.length < CODE_LENGTH) return;

    setLoading(true);
    setError('');

    try {
      const data = await authService.verifyEmail({ email, code: finalCode });
      useAuthStore.getState().setAuth(data);
      setVerified(true);
    } catch (err: any) {
      const errorCode = err?.response?.data?.code;
      if (errorCode === 'INVALID_OR_EXPIRED_CODE') {
        setError('Código inválido ou expirado');
      } else {
        setError('Erro ao verificar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await authService.resendCode(email);
      setCooldown(60);
    } catch {}
  };

  if (verified) {
    return (
      <AuthLayout>
        <ImageBackground
          source={require('../../../assets/img/ChatGPT Image 27 de mai. de 2026, 21_15_28.png')}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        >
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

          <View style={styles.verifiedContent}>
            <View style={styles.card}>
              <View style={styles.cardGlowBar} />
              <View style={styles.iconCircle}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Ionicons name="checkmark" size={36} color={colors.text} />
                </LinearGradient>
              </View>
              <Text style={styles.cardTitle}>CONFIRMADO</Text>
              <Text style={styles.cardSubtitle}>
                Seu e-mail foi verificado. Bem-vindo à arena.
              </Text>
            </View>
          </View>
        </ImageBackground>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ImageBackground
        source={require('../../../assets/img/ChatGPT Image 27 de mai. de 2026, 21_15_28.png')}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
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

        <LinearGradient
          colors={['rgba(109,46,192,0.15)', 'transparent']}
          locations={[0.3, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          {/* ─── Brand ─────────────────────────── */}
          <View style={styles.brandBlock}>
            <Text style={styles.brandName}>TOQUEPLAY</Text>
          </View>

          {/* ─── Card ──────────────────────────── */}
          <View style={styles.card}>
            <View style={styles.cardGlowBar} />

            <View style={styles.iconCircle}>
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name="mail" size={28} color={colors.text} />
              </LinearGradient>
            </View>

            <Text style={styles.cardTitle}>VERIFICAR E-MAIL</Text>
            <Text style={styles.cardSubtitle}>
              Enviamos um código de 6 dígitos para{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            {/* Code inputs */}
            <View style={styles.codeRow}>
              {code.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => { inputRefs.current[i] = ref; }}
                  value={digit}
                  onChangeText={(v) => handleChange(v, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  style={[
                    styles.codeInput,
                    !!digit && styles.codeInputFilled,
                    !!error && styles.codeInputError,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  textContentType="oneTimeCode"
                  autoFocus={i === 0}
                  editable={!loading}
                />
              ))}
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title={loading ? 'VERIFICANDO...' : 'VERIFICAR'}
              onPress={() => handleVerify()}
              disabled={code.join('').length < CODE_LENGTH || loading}
              style={{ marginTop: spacing.xl }}
            />

            {/* Resend */}
            <View style={styles.resendRow}>
              {cooldown > 0 ? (
                <Text style={styles.resendCooldown}>
                  Reenviar em {cooldown}s
                </Text>
              ) : (
                <Text style={styles.resendLink} onPress={handleResend}>
                  Não recebeu? Reenviar código
                </Text>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    minHeight: '100%',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  verifiedContent: {
    minHeight: '100%',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  brandBlock: {
    position: 'absolute',
    top: spacing.hero + 12,
    left: spacing.xl,
  },
  brandName: {
    fontFamily: fonts.title.display,
    fontSize: 42,
    lineHeight: 44,
    color: colors.text,
    letterSpacing: 6,
  },

  card: {
    backgroundColor: 'rgba(10,10,16,0.75)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.12)',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardGlowBar: {
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

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(109,46,192,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontFamily: fonts.title.display,
    fontSize: 32,
    lineHeight: 34,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    fontFamily: fonts.text.regular,
  },
  emailText: {
    color: colors.primaryGlow,
    fontFamily: fonts.text.semiBold,
  },

  // ─── Code inputs ────────────────────────────────
  codeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 24,
    fontFamily: fonts.title.display,
    textAlign: 'center',
    letterSpacing: 0,
  },
  codeInputFilled: {
    borderColor: colors.primaryGlow,
    backgroundColor: 'rgba(109,46,192,0.08)',
  },
  codeInputError: {
    borderColor: colors.error,
  },

  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
  },

  resendRow: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resendLink: {
    color: colors.primaryGlow,
    fontSize: 13,
    fontFamily: fonts.text.medium,
  },
  resendCooldown: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.text.regular,
  },
});
