import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { tournamentService } from '../../services/tournament';
import { BracketResponse, Match, RankingResponse } from '../../types/match';
import { BracketType } from '../../types/tournament';
import type { TournamentStackParamList } from '../../navigation/types';
import { useTournamentSocket } from '../../hooks/useTournamentSocket';
import { useAuthStore } from '../../stores/authStore';
import MatchList from './components/MatchList';
import PlayoffBracket from './components/PlayoffBracket';
import StandingsTable from './components/StandingsTable';
import GroupOverview from './components/GroupOverview';
import GroupTable from './components/GroupTable';
import HeroHeader from '../../components/HeroHeader';
import TabBar from '../../components/TabBar';
import ChevronButton from '../../components/ChevronButton';
import { useDialogStore } from '../../stores/dialogStore';

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'BracketView'>;
type Route = RouteProp<TournamentStackParamList, 'BracketView'>;

type TabKey = 'groups' | 'matches' | 'standings' | 'playoffs';

export default function BracketScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tournamentId, categoryId } = route.params;
  const userId = useAuthStore((s) => s.user?.id);
  const dialog = useDialogStore();

  const [activeTab, setActiveTab] = useState<TabKey>('matches');
  const [brackets, setBrackets] = useState<BracketResponse[]>([]);
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const [isReferee, setIsReferee] = useState(false);
  const [isInvitedNotConfirmed, setIsInvitedNotConfirmed] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [bracketData, rankingData, refs] = await Promise.all([
        tournamentService.getBracket(tournamentId, categoryId),
        tournamentService.getRanking(tournamentId).catch(() => null),
        tournamentService.getReferees(tournamentId).catch(() => []),
      ]);
      setBrackets(Array.isArray(bracketData) ? bracketData : [bracketData]);
      setRanking(rankingData as RankingResponse | null);
      const myRef = (refs as any[]).find((r: any) => r.userId === userId);
      setIsReferee(myRef?.codeConfirmed === true);
      setIsInvitedNotConfirmed(!!myRef && !myRef.codeConfirmed);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [tournamentId, categoryId, userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Real-time socket updates
  useTournamentSocket(tournamentId, loadData);

  // Derived data
  const { visibleMatches, groupMatches, eliminationMatches, hasVisibleElimination, tabs } = useMemo(() => {
    const allMatches = brackets.flatMap((b) => b.matches);
    const bracketType = brackets[0]?.type;

    const isRoundRobin = bracketType === BracketType.ROUND_ROBIN;
    const isElimination = bracketType === BracketType.SINGLE_ELIMINATION || bracketType === BracketType.DOUBLE_ELIMINATION;
    const isGroupsThenElimination = bracketType === BracketType.GROUPS_THEN_ELIMINATION;

    const gMatches = isGroupsThenElimination
      ? allMatches.filter((m) => m.group !== null && m.group !== undefined)
      : allMatches;

    const eMatches = isGroupsThenElimination
      ? allMatches.filter((m) => m.group === null || m.group === undefined)
      : [];

    const visibleElimination = eMatches.filter((m) => m.teamAId || m.teamBId);
    const hasVisibleElim = visibleElimination.length > 0;

    const visible = isElimination
      ? allMatches
      : [...gMatches, ...visibleElimination];

    const tabList: { key: TabKey; label: string }[] = [];
    if (isRoundRobin) {
      tabList.push({ key: 'matches', label: 'Jogos' });
      tabList.push({ key: 'standings', label: 'Classificação' });
    } else if (isElimination) {
      tabList.push({ key: 'matches', label: 'Jogos' });
      tabList.push({ key: 'playoffs', label: 'Chave' });
    } else if (isGroupsThenElimination) {
      tabList.push({ key: 'groups', label: 'Grupos' });
      tabList.push({ key: 'matches', label: 'Jogos' });
      tabList.push({ key: 'standings', label: 'Classificação' });
      if (hasVisibleElim) {
        tabList.push({ key: 'playoffs', label: 'Finais' });
      }
    }

    return {
      visibleMatches: visible,
      groupMatches: gMatches,
      eliminationMatches: eMatches,
      hasVisibleElimination: hasVisibleElim,
      tabs: tabList,
    };
  }, [brackets]);

  const bracketType = brackets[0]?.type;
  const isRoundRobin = bracketType === BracketType.ROUND_ROBIN;
  const isElimination = bracketType === BracketType.SINGLE_ELIMINATION || bracketType === BracketType.DOUBLE_ELIMINATION;
  const isGroupsThenElimination = bracketType === BracketType.GROUPS_THEN_ELIMINATION;

  const groupBracket = isGroupsThenElimination && brackets[0]
    ? [{ ...brackets[0], matches: groupMatches, type: BracketType.ROUND_ROBIN as BracketType }]
    : [];
  const eliminationBracket = isGroupsThenElimination && brackets[0]
    ? [{ ...brackets[0], matches: eliminationMatches.filter((m) => m.teamAId || m.teamBId), type: BracketType.SINGLE_ELIMINATION as BracketType }]
    : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <HeroHeader title="CHAVES" watermark="BRACKET" onBack={() => navigation.goBack()} rounded />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const currentTab = tabs.find(t => t.key === activeTab) ? activeTab : (tabs[0]?.key ?? 'matches');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader title="CHAVES" watermark="BRACKET" onBack={() => navigation.goBack()} rounded />

      {tabs.length > 1 && (
        <View style={styles.tabWrap}>
          <TabBar
            tabs={tabs.map((t) => ({ key: t.key, label: t.label }))}
            activeTab={currentTab}
            onTabChange={(key) => setActiveTab(key as TabKey)}
            variant="underline"
          />
        </View>
      )}

      {/* Code modal for invited-but-unconfirmed referees */}
      {isInvitedNotConfirmed && (
        <View style={styles.codeModal}>
          <View style={styles.codeModalCard}>
            <View style={styles.codeModalIcon}>
              <Ionicons name="lock-closed" size={40} color={colors.primary} />
            </View>
            <Text style={styles.codeModalTitle}>CÓDIGO DO ÁRBITRO</Text>
            <Text style={styles.codeModalDesc}>
              Informe o código fornecido pelo organizador para liberar o acesso ao chaveamento.
            </Text>
            <View style={styles.codeInputWrap}>
              <TextInput
                style={styles.codeInput}
                value={codeInput}
                onChangeText={setCodeInput}
                placeholder="ABC123"
                placeholderTextColor={colors.textPlaceholder}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={6}
                autoFocus
                textAlign="center"
              />
            </View>
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={async () => {
                if (codeInput.trim().length < 6) return;
                setCodeLoading(true);
                try {
                  await tournamentService.enterRefereeCode(codeInput.trim().toUpperCase());
                  setIsReferee(true);
                  setIsInvitedNotConfirmed(false);
                  setCodeInput('');
                } catch {
                  dialog.error('Código expirado ou incorreto.', 'Código inválido');
                } finally {
                  setCodeLoading(false);
                }
              }}
              disabled={codeLoading || codeInput.trim().length < 6}
              icon={<Ionicons name="unlock-outline" size={16} color="#FFFFFF" />}
            >
              {codeLoading ? 'VERIFICANDO...' : 'LIBERAR ACESSO'}
            </ChevronButton>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }}>
              <Text style={{ color: colors.textMuted, fontSize: typography.sizes.body, fontFamily: fonts.text.regular }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Normal bracket content */}
      {!isInvitedNotConfirmed && (
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {currentTab === 'groups' && isGroupsThenElimination && (
          <GroupOverview brackets={groupBracket} />
        )}

        {currentTab === 'matches' && (
          <MatchList matches={visibleMatches} tournamentId={tournamentId} isReferee={isReferee} />
        )}

        {currentTab === 'standings' && (isRoundRobin || isGroupsThenElimination) && (
          <GroupTable brackets={isGroupsThenElimination ? groupBracket : brackets} />
        )}
        {currentTab === 'standings' && ranking && !isRoundRobin && !isGroupsThenElimination && (
          <StandingsTable ranking={ranking} />
        )}

        {currentTab === 'playoffs' && isElimination && (
          <PlayoffBracket brackets={brackets} />
        )}
        {currentTab === 'playoffs' && isGroupsThenElimination && (
          <PlayoffBracket brackets={eliminationBracket} />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  tabWrap: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  content: { paddingHorizontal: spacing.xl },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Code modal
  codeModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,30,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  codeModalCard: {
    width: '85%',
    backgroundColor: colors.surface,
    borderRadius: radius.section,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  codeModalIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  codeModalTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.display,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.md,
  },
  codeModalDesc: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  codeInputWrap: {
    width: '100%',
    backgroundColor: colors.inputBackground,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    height: 56,
    justifyContent: 'center',
  },
  codeInput: {
    color: colors.text,
    fontFamily: fonts.title.regular,
    fontSize: 32,
    letterSpacing: 4,
    paddingHorizontal: spacing.xl,
    paddingVertical: 0,
    margin: 0,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
