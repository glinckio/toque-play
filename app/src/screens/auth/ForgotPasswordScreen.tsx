import React, { useState } from 'react';
import {
  View,
  Text,
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
      // Always show success to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LinearGradient
        colors={['rgba(109,46,192,0.08)', 'transparent']}
        locations={[0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>

        {/* ─── Card ──────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardGlowBar} />

          {!sent ? (
            <>
              {/* Icon */}
              <View style={styles.iconCircle}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Ionicons name="key" size={28} color={colors.text} />
                </LinearGradient>
              </View>

              <Text style={styles.cardTitle}>RECUPERAR SENHA</Text>
              <Text style={styles.cardSubtitle}>
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
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

              <Button
                title={loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
                onPress={handleSend}
                disabled={email.length === 0 || loading}
                style={{ marginTop: spacing.xl }}
              />
            </>
          ) : (
            <>
              {/* Sent state */}
              <View style={styles.iconCircle}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Ionicons name="checkmark" size={32} color={colors.text} />
                </LinearGradient>
              </View>

              <Text style={styles.cardTitle}>E-MAIL ENVIADO</Text>
              <Text style={styles.cardSubtitle}>
                Verifique sua caixa de entrada e siga as instruções para
                redefinir sua senha.
              </Text>

              <Button
                title="VOLTAR AO LOGIN"
                onPress={() => navigation.navigate('Login')}
                style={{ marginTop: spacing.xl }}
              />
            </>
          )}
        </View>

        {/* ─── Footer ───────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lembrou a senha?{' '}
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
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  card: {
    backgroundColor: 'rgba(10,10,16,0.75)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.12)',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
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
    alignSelf: 'center',
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
