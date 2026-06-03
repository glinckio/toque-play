import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { registrationService } from '../../services/registration';
import type { TournamentStackParamList } from '../../navigation/types';
import { RegistrationStatus } from '../../types/registration';

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'RegistrationSummary'>;
type Route = RouteProp<TournamentStackParamList, 'RegistrationSummary'>;

function formatBRL(v: any) {
  const n = Number(v);
  if (!v || isNaN(n) || n === 0) return 'Grátis';
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}

export default function RegistrationSummary() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { registrationId } = route.params;

  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      registrationService
        .findOne(registrationId)
        .then(setRegistration)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [registrationId]),
  );

  const handlePayment = useCallback(async () => {
    if (!registration) return;

    if (registration.status === RegistrationStatus.PENDING_CONFIRMATION) {
      Alert.alert('Sucesso', 'Inscrição registrada! Aguardando confirmação do organizador.');
      navigation.goBack();
      return;
    }

    setPaying(true);
    try {
      const { url } = await registrationService.createCheckout(registrationId);
      navigation.push('PaymentWebView', { checkoutUrl: url, registrationId });
    } catch {
      Alert.alert('Erro', 'Não foi possível iniciar o pagamento');
    } finally {
      setPaying(false);
    }
  }, [registration, registrationId, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  const isFree = !registration?.category?.registrationPrice;
  const stage = registration?.tournament?.stages?.[0];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RESUMO</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Success icon for free */}
        {isFree && (
          <View style={styles.iconCircle}>
            <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.iconGradient}>
              <Ionicons name="checkmark" size={32} color={colors.text} />
            </LinearGradient>
          </View>
        )}

        {/* Info rows */}
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Torneio</Text>
            <Text style={styles.rowValue}>{registration?.tournament?.name ?? '—'}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Equipe</Text>
            <Text style={styles.rowValue}>{registration?.team?.name ?? '—'}</Text>
          </View>
          <View style={styles.rowDivider} />
          {registration?.category && (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Categoria</Text>
                <Text style={styles.rowValue}>
                  {registration.category.type === 'MALE' ? 'Masculino' : registration.category.type === 'FEMALE' ? 'Feminino' : 'Misto'} · {registration.category.format === 'PAIR' ? 'Dupla' : registration.category.format === 'QUARTET' ? 'Quarteto' : 'Sexteto'} · {registration.category.modality === 'BEACH' ? 'Areia' : 'Quadra'}
                </Text>
              </View>
              <View style={styles.rowDivider} />
            </>
          )}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Valor</Text>
            <Text style={[styles.rowValue, styles.priceValue]}>
              {formatBRL(registration?.category?.registrationPrice)}
            </Text>
          </View>
        </View>

        {/* Action */}
        {isFree ? (
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
              <Text style={styles.ctaText}>CONCLUIR</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.ctaBtn} onPress={handlePayment} disabled={paying} activeOpacity={0.8}>
            <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
              {paying ? <ActivityIndicator color={colors.text} size="small" /> : <Text style={styles.ctaText}>PAGAR</Text>}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontFamily: fonts.title.display, fontSize: 22, color: colors.text, letterSpacing: 2 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },

  iconCircle: {
    width: 72, height: 72, borderRadius: 22, overflow: 'hidden',
    alignSelf: 'center', marginBottom: spacing.xxl,
  },
  iconGradient: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  rowLabel: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular },
  rowValue: { fontSize: 14, color: colors.text, fontFamily: fonts.text.semiBold, flex: 1, textAlign: 'right' },
  priceValue: { color: colors.primaryGlow, fontSize: 18, fontFamily: fonts.title.display },
  rowDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)' },

  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.lg, gap: spacing.sm,
  },
  ctaText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },
});
