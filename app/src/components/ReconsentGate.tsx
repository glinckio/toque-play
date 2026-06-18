import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';
import ChevronButton from './ChevronButton';
import { privacyService, type ConsentsState } from '../services/privacy';
import { useAuthStore } from '../stores/authStore';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '../config/legal-urls';

/**
 * Full-screen blocking overlay shown when the active TERMS_VERSION differs
 * from what the user previously accepted. Forces explicit re-acceptance
 * before any navigation is allowed (LGPD art. 8 — material change).
 */
export function ReconsentGate() {
  const setRequiresReconsent = useAuthStore((s) => s.setRequiresReconsent);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [state, setState] = useState<ConsentsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    privacyService
      .getConsents()
      .then(setState)
      .catch(() => setState(null))
      .finally(() => setLoading(false));
  }, []);

  const accept = async () => {
    setAccepting(true);
    try {
      await privacyService.acceptCurrentTerms();
      setRequiresReconsent(false);
    } catch {
      // noop — user can retry
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="document-text-outline" size={40} color={colors.primary} />
        </View>

        <Text style={styles.title}>Termos atualizados</Text>
        <Text style={styles.subtitle}>
          Os Termos de Uso e a Política de Privacidade foram atualizados (versão{' '}
          {state?.version ?? '—'}). Para continuar usando o ToquePlay, você
          precisa revisar e aceitar a nova versão.
        </Text>

        <View style={styles.linksRow}>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => Linking.openURL(TERMS_OF_USE_URL)}
          >
            <Ionicons name="document-text-outline" size={16} color={colors.primary} />
            <Text style={styles.linkText}>Ler Termos de Uso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            <Text style={styles.linkText}>Política de Privacidade</Text>
          </TouchableOpacity>
        </View>

        {state?.lastAcceptedVersion && (
          <Text style={styles.lastVersion}>
            Você havia aceito a versão {state.lastAcceptedVersion} em{' '}
            {state.lastAcceptedAt
              ? new Date(state.lastAcceptedAt).toLocaleDateString('pt-BR')
              : '—'}
            .
          </Text>
        )}

        <View style={styles.actions}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={accept}
            disabled={accepting}
          >
            {accepting ? 'ACEITANDO...' : 'ACEITAR E CONTINUAR'}
          </ChevronButton>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => clearAuth()}
            disabled={accepting}
          >
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'stretch',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.display,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryTint,
  },
  linkText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
  lastVersion: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textPlaceholder,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
});
