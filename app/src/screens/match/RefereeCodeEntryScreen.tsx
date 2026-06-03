import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { tournamentService } from '../../services/tournament';
import { friendlyService } from '../../services/friendly';

export default function RefereeCodeEntryScreen({ route }: any) {
  const mode: 'tournament' | 'friendly' = route.params?.mode ?? 'tournament';
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnter = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 6) {
      Alert.alert('Código inválido', 'Digite o código de 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'friendly') {
        const result = await friendlyService.enterRefereeCode(trimmed);
        const matchId = result.match?.id ?? (result as any).matchId;
        if (matchId) {
          // Dismiss modal then navigate
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'Main' },
                { name: 'Friendly', params: { screen: 'LiveMatch', params: { matchId } } },
              ],
            })
          );
        } else {
          Alert.alert('Sucesso', 'Código validado!');
          navigation.goBack();
        }
      } else {
        const result = await tournamentService.enterRefereeCode(trimmed);
        const tournamentId = result.tournamentId;

        if (tournamentId) {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: 'Main' },
                { name: 'Tournament', params: { screen: 'BracketView', params: { tournamentId } } },
              ],
            })
          );
        } else {
          Alert.alert('Erro', 'Torneio não encontrado.');
        }
      }
    } catch (e: any) {
      Alert.alert('Código inválido', 'Código expirado ou não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="flag-outline" size={36} color={colors.primaryGlow} />
          </View>

          <Text style={styles.title}>CÓDIGO DO ÁRBITRO</Text>
          <Text style={styles.subtitle}>
            {mode === 'friendly'
              ? 'Digite o código fornecido pelo capitão para apitar o amistoso.'
              : 'Digite o código fornecido pelo organizador para apitar a partida.'}
          </Text>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="ABC123"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              autoFocus
              textAlign="center"
            />
          </View>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleEnter}
            disabled={loading || code.trim().length < 6}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryGlow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ctaGradient, (loading || code.trim().length < 6) && styles.ctaDisabled]}
            >
              {loading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <>
                  <Ionicons name="enter-outline" size={20} color={colors.text} />
                  <Text style={styles.ctaText}>ENTRAR COMO ÁRBITRO</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    paddingTop: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(109,46,192,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: fonts.title.display,
    fontSize: 28,
    color: colors.text,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.section,
  },
  inputCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
  input: {
    fontFamily: fonts.title.display,
    fontSize: 40,
    color: colors.text,
    letterSpacing: 8,
    paddingVertical: spacing.md,
  },
  ctaBtn: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },
});
