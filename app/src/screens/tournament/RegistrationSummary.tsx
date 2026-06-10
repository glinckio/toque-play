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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { registrationService } from '../../services/registration';
import type { TournamentStackParamList } from '../../navigation/types';
import { RegistrationStatus } from '../../types/registration';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

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
        <HeroHeader title="RESUMO" watermark="SUMMARY" onBack={() => navigation.goBack()} rounded />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const isFree = !registration?.category?.registrationPrice;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader title="RESUMO" watermark="SUMMARY" onBack={() => navigation.goBack()} rounded />

      <View style={styles.content}>
        {/* Success icon for free */}
        {isFree && (
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={32} color={colors.primary} />
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
        <View style={{ marginTop: spacing.xxl }}>
          {isFree ? (
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => navigation.goBack()}
            >
              CONCLUIR
            </ChevronButton>
          ) : (
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={handlePayment}
              disabled={paying}
            >
              {paying ? 'PROCESSANDO...' : 'PAGAR'}
            </ChevronButton>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },

  iconCircle: {
    width: 72, height: 72, borderRadius: 22,
    alignSelf: 'center', marginBottom: spacing.xxl,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  rowLabel: { fontSize: typography.sizes.body, color: colors.textMuted, fontFamily: fonts.text.regular },
  rowValue: { fontSize: typography.sizes.input, color: colors.text, fontFamily: fonts.text.semiBold, flex: 1, textAlign: 'right' },
  priceValue: { color: colors.primary, fontSize: typography.sizes.display, fontFamily: fonts.title.regular },
  rowDivider: { height: 1, backgroundColor: '#F4EFFA' },
});
