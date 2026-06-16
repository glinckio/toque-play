import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import HeroHeader from '../../components/HeroHeader';
import { privacyService } from '../../services/privacy';

export default function DataExportScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await privacyService.exportData();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      const code = err?.response?.data?.code;
      if (code === 'DATA_EXPORT_RATE_LIMITED') {
        Alert.alert('Aguarde', 'Você já solicitou uma exportação hoje. Tente novamente amanhã.');
      } else {
        Alert.alert('Erro', 'Não foi possível gerar a exportação.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    try {
      await Share.share({ message: result });
    } catch {
      /* ignore */
    }
  };

  return (
    <ScrollView style={styles.container}>
      <HeroHeader
        title="Exportar dados"
        subtitle="Receba uma cópia completa (LGPD art. 18, V)"
        watermark="Export"
        rounded
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <Ionicons name="download-outline" size={28} color={colors.primary} />
          <Text style={styles.title}>Portabilidade dos seus dados</Text>
          <Text style={styles.hint}>
            Inclui: perfil, consentimentos, times, inscrições, amistosos, notificações,
            mensagens de chat enviadas e logs de auditoria.
          </Text>
          <Text style={styles.hint}>
            Limite: uma exportação a cada 24 horas.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleExport}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.buttonText}>GERAR EXPORTAÇÃO</Text>
            )}
          </TouchableOpacity>

          {result && (
            <View style={styles.resultBox}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Dados exportados ({result.length} bytes)</Text>
                <TouchableOpacity onPress={handleShare}>
                  <Ionicons name="share-outline" size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultPreview} numberOfLines={20}>
                {result.slice(0, 2000)}
                {result.length > 2000 ? '\n…' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { paddingHorizontal: spacing.xl, paddingBottom: spacing.section },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
  hint: {
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.md,
  },
  resultBox: {
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultTitle: {
    color: colors.text,
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.sm,
  },
  resultPreview: {
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.xs,
  },
});
