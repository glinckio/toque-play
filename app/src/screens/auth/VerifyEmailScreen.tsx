import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import type { AuthStackParamList } from '../../navigation/types';
import AuthLayout from '../../components/AuthLayout';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';
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

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

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
        <HeroHeader title="CONFIRMADO" watermark="OK" variant="primary" rounded />
        <View style={styles.verifiedContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.verifiedTitle}>E-mail verificado!</Text>
          <Text style={styles.verifiedSubtitle}>
            Bem-vindo ao ToquePlay. Sua conta está pronta.
          </Text>
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <HeroHeader
        title="VERIFICAR E-MAIL"
        subtitle={`Enviamos um código de 6 dígitos para ${email}`}
        watermark="EMAIL"
        rounded
      />

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="mail" size={32} color={colors.primary} />
        </View>

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

        <View style={{ marginTop: spacing.xl }}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => handleVerify()}
            disabled={code.join('').length < CODE_LENGTH || loading}
          >
            {loading ? 'VERIFICANDO...' : 'VERIFICAR'}
          </ChevronButton>
        </View>

        {/* Resend */}
        <View style={styles.resendRow}>
          {cooldown > 0 ? (
            <Text style={styles.resendCooldown}>Reenviar em {cooldown}s</Text>
          ) : (
            <Text style={styles.resendLink} onPress={handleResend}>
              Não recebeu? Reenviar código
            </Text>
          )}
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  verifiedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  verifiedTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.display,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  verifiedSubtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  codeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: 'transparent',
    color: colors.text,
    fontSize: 24,
    fontFamily: fonts.title.regular,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  codeInputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
  },
  resendRow: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  resendLink: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontFamily: fonts.text.medium,
  },
  resendCooldown: {
    color: colors.textMuted,
    fontSize: typography.sizes.body,
    fontFamily: fonts.text.regular,
  },
});
