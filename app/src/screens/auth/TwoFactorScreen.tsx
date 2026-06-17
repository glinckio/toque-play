import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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

type Nav = NativeStackNavigationProp<AuthStackParamList, 'TwoFactor'>;
type Route = RouteProp<AuthStackParamList, 'TwoFactor'>;

export default function TwoFactorScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { temporaryToken, email } = route.params;

  const [code, setCode] = useState('');
  const [backupMode, setBackupMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const maxLen = backupMode ? 8 : 6;

  const handleChange = (value: string) => {
    const cleaned = backupMode
      ? value.replace(/[^a-fA-F0-9]/g, '').toUpperCase()
      : value.replace(/\D/g, '');
    setCode(cleaned.slice(0, maxLen));
    setError('');
  };

  const handleVerify = async () => {
    if (code.length !== maxLen) return;
    setLoading(true);
    setError('');
    try {
      const data = await authService.verifyLogin2fa({
        temporaryToken,
        code,
      });
      useAuthStore.getState().setAuth(data);
    } catch (err: any) {
      const errorCode = err?.response?.data?.code;
      if (errorCode === 'INVALID_OR_EXPIRED_CODE') {
        setError('Código inválido ou expirado. Tente novamente.');
      } else {
        setError(err?.response?.data?.message ?? 'Erro ao verificar código.');
      }
      setCode('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <HeroHeader
        title="AUTENTICAÇÃO 2FA"
        subtitle={`Digite o código do app autenticador para ${email}`}
        watermark="2FA"
        rounded
      />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark-outline" size={32} color={colors.primary} />
        </View>

        <Text style={styles.label}>
          {backupMode
            ? 'CÓDIGO DE BACKUP (8 CARACTERES)'
            : 'CÓDIGO DE 6 DÍGITOS'}
        </Text>

        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleChange}
          style={[
            styles.codeInput,
            backupMode && styles.codeInputBackup,
            !!error && styles.codeInputError,
          ]}
          keyboardType={backupMode ? 'default' : 'number-pad'}
          maxLength={maxLen}
          autoFocus
          autoCapitalize={backupMode ? 'characters' : 'none'}
          placeholder={backupMode ? 'A1B2C3D4' : '000000'}
          placeholderTextColor={colors.textPlaceholder}
          textContentType="oneTimeCode"
          editable={!loading}
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={{ marginTop: spacing.xl }}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleVerify}
            disabled={code.length !== maxLen || loading}
          >
            {loading ? 'VERIFICANDO...' : 'VERIFICAR'}
          </ChevronButton>
        </View>

        <TouchableOpacity
          style={styles.modeToggle}
          onPress={() => {
            setBackupMode((v) => !v);
            setCode('');
            setError('');
          }}
          disabled={loading}
        >
          <Ionicons
            name={backupMode ? 'key-outline' : 'key'}
            size={16}
            color={colors.primary}
          />
          <Text style={styles.modeToggleText}>
            {backupMode ? 'Usar código TOTP do app' : 'Usar código de backup'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.backText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
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
  label: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  codeInput: {
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: 'transparent',
    color: colors.text,
    fontSize: 32,
    fontFamily: fonts.title.regular,
    textAlign: 'center',
    letterSpacing: 8,
  },
  codeInputBackup: {
    fontSize: 24,
    letterSpacing: 4,
  },
  codeInputError: {
    borderColor: colors.error,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  modeToggleText: {
    color: colors.primary,
    fontSize: typography.sizes.body,
    fontFamily: fonts.text.medium,
  },
  backBtn: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backText: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
  },
});
