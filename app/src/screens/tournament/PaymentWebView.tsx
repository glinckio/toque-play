import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
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

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'PaymentWebView'>;
type Route = RouteProp<TournamentStackParamList, 'PaymentWebView'>;

const POLL_INTERVAL = 2000;
const POLL_MAX = 60;

export default function PaymentWebView() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { checkoutUrl, registrationId } = route.params;

  const [cancelled, setCancelled] = useState(false);
  const [paid, setPaid] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    let attempts = 0;
    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const reg = await registrationService.findOne(registrationId);
        if (reg.status === RegistrationStatus.CONFIRMED) {
          stopPolling();
          setPaid(true);
        }
      } catch {}
      if (attempts >= POLL_MAX) stopPolling();
    }, POLL_INTERVAL);
  }, [registrationId, stopPolling]);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling]);

  const handleShouldStartLoad = useCallback(
    (request: WebViewNavigation) => {
      const url = (request.url ?? '').toLowerCase();
      if (url.includes('success') || url.includes('payment/success')) {
        startPolling();
        return false;
      }
      if (url.includes('cancel') || url.includes('payment/cancel')) {
        stopPolling();
        setCancelled(true);
        return false;
      }
      return true;
    },
    [startPolling, stopPolling],
  );

  const handleClose = useCallback(() => {
    stopPolling();
    setCancelled(true);
  }, [stopPolling]);

  if (paid) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.resultContainer}>
          <View style={styles.resultIcon}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.resultTitle}>PAGAMENTO CONFIRMADO</Text>
          <Text style={styles.resultText}>Sua inscrição foi confirmada com sucesso!</Text>
          <TouchableOpacity style={styles.resultBtn} onPress={() => navigation.popToTop()} activeOpacity={0.7}>
            <Text style={styles.resultBtnText}>CONCLUIR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (cancelled) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.resultContainer}>
          <View style={styles.resultIcon}>
            <Ionicons name="close-circle" size={64} color={colors.error} />
          </View>
          <Text style={styles.resultTitle}>PAGAMENTO CANCELADO</Text>
          <Text style={styles.resultText}>O pagamento não foi concluído. Sua inscrição continua pendente.</Text>
          <TouchableOpacity style={styles.resultBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.resultBtnText}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAGAMENTO</Text>
        <View style={{ width: 26 }} />
      </View>
      <WebView
        source={{ uri: checkoutUrl }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        startInLoadingState
        style={{ backgroundColor: colors.background }}
      />
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
  headerTitle: { fontFamily: fonts.title.regular, fontSize: 22, color: colors.text, letterSpacing: 2 },

  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  resultIcon: { marginBottom: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontFamily: fonts.title.regular, fontSize: 28, color: colors.text, letterSpacing: 3, marginBottom: spacing.md },
  resultText: { fontSize: 14, color: colors.textMuted, fontFamily: fonts.text.regular, marginBottom: spacing.xxl, textAlign: 'center' },
  resultBtn: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  resultBtnText: { fontSize: 14, color: colors.text, fontFamily: fonts.text.semiBold, letterSpacing: 2 },
});
