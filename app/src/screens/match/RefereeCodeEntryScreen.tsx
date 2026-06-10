import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { tournamentService } from '../../services/tournament';
import { friendlyService } from '../../services/friendly';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

export default function RefereeCodeEntryScreen({ route }: any) {
  const mode: 'auto' | 'tournament' | 'friendly' = route.params?.mode ?? 'auto';
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const navigateToTournament = (tournamentId: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          { name: 'Tournament', params: { screen: 'BracketView', params: { tournamentId } } },
        ],
      })
    );
  };

  const navigateToLiveMatch = (matchId: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          { name: 'Tournament', params: { screen: 'LiveMatch', params: { matchId } } },
        ],
      })
    );
  };

  const navigateToFriendlyMatch = (matchId: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Main' },
          { name: 'Friendly', params: { screen: 'LiveMatch', params: { matchId } } },
        ],
      })
    );
  };

  const handleEnter = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 6) {
      Alert.alert('Código inválido', 'Digite o código de 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      // Auto mode: try tournament → friendly sequentially
      if (mode === 'auto' || mode === 'tournament') {
        try {
          const result = await tournamentService.enterRefereeCode(trimmed);
          if (result.tournamentId) {
            navigateToTournament(result.tournamentId);
            return;
          }
        } catch {}
      }

      if (mode === 'auto' || mode === 'friendly') {
        try {
          const result = await friendlyService.enterRefereeCode(trimmed);
          const matchId = result.match?.id ?? (result as any).matchId;
          if (matchId) {
            navigateToFriendlyMatch(matchId);
            return;
          }
        } catch {}
      }

      Alert.alert('Código inválido', 'Código expirado ou não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top }} />
      <HeroHeader
        title="CÓDIGO DO ÁRBITRO"
        variant="dark"
        onBack={() => navigation.goBack()}
        rounded
        compact
        closeIcon
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="flag-outline" size={36} color={colors.primaryLight} />
          </View>

          <Text style={styles.subtitle}>
            {mode === 'friendly'
              ? 'Digite o código fornecido pelo capitão para apitar o amistoso.'
              : 'Digite o código fornecido pelo organizador ou capitão para acessar a partida.'}
          </Text>

          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="ABC123"
              placeholderTextColor={colors.textPlaceholder}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              textAlign="center"
            />
          </View>

          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleEnter}
            disabled={loading || code.trim().length < 6}
            icon={<Ionicons name="enter-outline" size={16} color="#FFFFFF" />}
          >
            {loading ? 'VERIFICANDO...' : 'ENTRAR COMO ÁRBITRO'}
          </ChevronButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.dark },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.hero,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(109,46,192,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.regular,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.section,
  },
  inputCard: {
    width: '100%',
    backgroundColor: colors.darkSecondary,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  input: {
    fontFamily: fonts.title.regular,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: 4,
    padding: 0,
    margin: 0,
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
  },
});
