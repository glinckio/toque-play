import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import HeroHeader from '../../components/HeroHeader';
import { privacyService, type ConsentsState } from '../../services/privacy';
import type { RootStackParamList } from '../../navigation/types';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const PRIVACY_POLICY_URL = 'https://toqueplay.com/privacy-policy';
const TERMS_OF_USE_URL = 'https://toqueplay.com/terms-of-use';

export default function PrivacyConsentScreen() {
  const navigation = useNavigation<RootNav>();
  const [state, setState] = useState<ConsentsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    privacyService
      .getConsents()
      .then(setState)
      .catch(() => setError('Não foi possível carregar seus consentimentos.'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key: 'notificationsPush' | 'locationDiscovery' | 'marketingEmail') => {
    if (!state || saving) return;
    const newValue = !state.consents[key];
    // optimistic
    setState({
      ...state,
      consents: { ...state.consents, [key]: newValue },
    });
    setSaving(true);
    privacyService
      .updateConsents({ [key]: newValue })
      .then(setState)
      .catch(() => {
        // revert
        setState((prev) =>
          prev
            ? {
                ...prev,
                consents: { ...prev.consents, [key]: !newValue },
              }
            : prev,
        );
        Alert.alert('Erro', 'Não foi possível atualizar o consentimento.');
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HeroHeader
        title="Privacidade"
        subtitle="Gerencie seus consentimentos (LGPD)"
        watermark="LGPD"
        rounded
      />

      <View style={styles.body}>
        <View style={styles.versionRow}>
          <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
          <Text style={styles.versionText}>
            Versão dos termos: <Text style={styles.versionBadge}>{state?.version ?? '—'}</Text>
          </Text>
        </View>
        {state?.lastAcceptedAt && (
          <Text style={styles.acceptedAt}>
            Aceitos em {new Date(state.lastAcceptedAt).toLocaleDateString('pt-BR')}
          </Text>
        )}

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TERMOS E PRIVACIDADE</Text>
          <View style={styles.lockedRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Termos de Uso e Política de Privacidade</Text>
              <Text style={styles.rowHint}>Obrigatório para uso da plataforma.</Text>
              <View style={styles.linksRow}>
                <TouchableOpacity onPress={() => Linking.openURL(TERMS_OF_USE_URL)}>
                  <Text style={styles.link}>Termos</Text>
                </TouchableOpacity>
                <Text style={styles.linkDivider}>·</Text>
                <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                  <Text style={styles.link}>Política</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={12} color={colors.textOnPrimary} />
              <Text style={styles.lockedText}>Obrigatório</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONSENTIMENTOS OPCIONAIS</Text>

          <ConsentRow
            icon="notifications-outline"
            label="Notificações push"
            hint="Avisos sobre jogos, torneios e amistosos."
            value={state?.consents.notificationsPush ?? false}
            onToggle={() => toggle('notificationsPush')}
            disabled={saving}
          />
          <ConsentRow
            icon="location-outline"
            label="Localização para descoberta"
            hint="Mostra torneios próximos a você."
            value={state?.consents.locationDiscovery ?? false}
            onToggle={() => toggle('locationDiscovery')}
            disabled={saving}
          />
          <ConsentRow
            icon="mail-outline"
            label="Marketing por email"
            hint="Novidades e promoções (sem spam)."
            value={state?.consents.marketingEmail ?? false}
            onToggle={() => toggle('marketingEmail')}
            disabled={saving}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIREITOS DO TITULAR (LGPD art. 18)</Text>

          <ActionRow
            icon="download-outline"
            label="Exportar meus dados"
            hint="Receba uma cópia completa dos seus dados (1 vez/dia)."
            onPress={() => navigation.navigate('DataExport')}
          />
          <ActionRow
            icon="trash-outline"
            label="Excluir minha conta"
            hint="Anonimiza seus dados. Operação irreversível."
            danger
            onPress={() => navigation.navigate('DeleteAccount')}
          />
          <ActionRow
            icon="chatbubble-ellipses-outline"
            label="Falar com o DPO"
            hint="Solicitação formal de direitos — acesso, correção, reclamação."
            onPress={() => navigation.navigate('DpoContact')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function ConsentRow({
  icon,
  label,
  hint,
  value,
  onToggle,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.consentRow}>
      <View style={styles.consentIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: colors.divider, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function ActionRow({
  icon,
  label,
  hint,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.consentRow} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.consentIcon, danger && styles.consentIconDanger]}>
        <Ionicons name={icon} size={18} color={danger ? colors.error : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, danger && { color: colors.error }]}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.section },
  versionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  versionText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontFamily: fonts.text.regular,
  },
  versionBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
    color: colors.text,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.xs,
  },
  acceptedAt: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontFamily: fonts.text.regular,
    marginTop: 4,
  },
  section: { marginTop: spacing.xl },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontFamily: fonts.text.bold,
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  rowLabel: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.bold,
  },
  rowHint: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontFamily: fonts.text.regular,
    marginTop: 2,
  },
  linksRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  link: {
    color: colors.primary,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.sm,
    textDecorationLine: 'underline',
  },
  linkDivider: { color: colors.textMuted },
  lockedBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedText: {
    color: colors.textOnPrimary,
    fontSize: typography.sizes.xs,
    fontFamily: fonts.text.bold,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  consentIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentIconDanger: { backgroundColor: 'rgba(224,69,69,0.1)' },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
    marginTop: spacing.md,
  },
});
