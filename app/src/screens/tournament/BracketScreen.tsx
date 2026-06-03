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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
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

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'BracketView'>;
type Route = RouteProp<TournamentStackParamList, 'BracketView'>;

type TabKey = 'groups' | 'matches' | 'standings' | 'playoffs';

export default function BracketScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tournamentId, categoryId } = route.params;
  const userId = useAuthStore((s) => s.user?.id);

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

    // Only show elimination matches that have at least one team assigned
    const visibleElimination = eMatches.filter((m) => m.teamAId || m.teamBId);
    const hasVisibleElim = visibleElimination.length > 0;

    // For MatchList: show group matches + visible elimination matches (interleaved)
    const visible = isElimination
      ? allMatches // for pure elimination, show all
      : [...gMatches, ...visibleElimination]; // for groups+elim, hide TBD

    // Build tabs based on bracket type
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

  // Bracket objects for sub-components
  const groupBracket = isGroupsThenElimination && brackets[0]
    ? [{ ...brackets[0], matches: groupMatches, type: BracketType.ROUND_ROBIN as BracketType }]
    : [];
  const eliminationBracket = isGroupsThenElimination && brackets[0]
    ? [{ ...brackets[0], matches: eliminationMatches.filter((m) => m.teamAId || m.teamBId), type: BracketType.SINGLE_ELIMINATION as BracketType }]
    : [];

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>CHAVES</Text>
        </View>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Auto-select first tab if current tab not available
  const currentTab = tabs.find(t => t.key === activeTab) ? activeTab : (tabs[0]?.key ?? 'matches');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>CHAVES</Text>
      </View>

      {tabs.length > 1 && (
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, currentTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLabel, currentTab === tab.key && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Code modal for invited-but-unconfirmed referees */}
      {isInvitedNotConfirmed && (
        <View style={styles.codeModal}>
          <View style={styles.codeModalCard}>
            <View style={styles.codeModalIcon}>
              <Ionicons name="lock-closed" size={40} color={colors.primaryGlow} />
            </View>
            <Text style={styles.codeModalTitle}>CÓDIGO DO ÁRBITRO</Text>
            <Text style={styles.codeModalDesc}>
              Informe o código fornecido pelo organizador para liberar o acesso ao chaveamento.
            </Text>
            <TextInput
              style={styles.codeModalInput}
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder="ABC123"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              autoFocus
              textAlign="center"
            />
            <TouchableOpacity
              style={styles.codeModalBtn}
              onPress={async () => {
                if (codeInput.trim().length < 6) return;
                setCodeLoading(true);
                try {
                  await tournamentService.enterRefereeCode(codeInput.trim().toUpperCase());
                  setIsReferee(true);
                  setIsInvitedNotConfirmed(false);
                  setCodeInput('');
                } catch {
                  Alert.alert('Código inválido', 'Código expirado ou incorreto.');
                } finally {
                  setCodeLoading(false);
                }
              }}
              disabled={codeLoading || codeInput.trim().length < 6}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.codeModalBtnGradient, (codeLoading || codeInput.trim().length < 6) && { opacity: 0.4 }]}
              >
                {codeLoading ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <>
                    <Ionicons name="unlock-outline" size={20} color={colors.text} />
                    <Text style={styles.codeModalBtnText}>LIBERAR ACESSO</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }}>
              <Text style={{ color: colors.textMuted, fontSize: 13, fontFamily: fonts.text.regular }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Normal bracket content — hidden behind code modal if not confirmed */}
      {!isInvitedNotConfirmed && (
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Grupos: visual overview with team cards */}
        {currentTab === 'groups' && isGroupsThenElimination && (
          <GroupOverview brackets={groupBracket} />
        )}

        {/* Jogos: match list */}
        {currentTab === 'matches' && (
          <MatchList matches={visibleMatches} tournamentId={tournamentId} isReferee={isReferee} />
        )}

        {/* Classificação: standings table */}
        {currentTab === 'standings' && (isRoundRobin || isGroupsThenElimination) && (
          <GroupTable brackets={isGroupsThenElimination ? groupBracket : brackets} />
        )}
        {currentTab === 'standings' && ranking && !isRoundRobin && !isGroupsThenElimination && (
          <StandingsTable ranking={ranking} />
        )}

        {/* Finais: playoff bracket (only when teams are assigned) */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  backBtn: { marginRight: spacing.md },
  title: { fontSize: 28, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 3 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },

  // Code modal
  codeModal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,6,10,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  codeModalCard: {
    width: '85%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.2)',
    padding: spacing.xxl,
    alignItems: 'center',
  },
  codeModalIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(109,46,192,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  codeModalTitle: {
    fontFamily: fonts.title.display,
    fontSize: 24,
    color: colors.text,
    letterSpacing: 3,
    marginBottom: spacing.md,
  },
  codeModalDesc: {
    fontSize: 14,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  codeModalInput: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    color: colors.text,
    fontFamily: fonts.title.display,
    fontSize: 36,
    letterSpacing: 8,
    marginBottom: spacing.xl,
  },
  codeModalBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  codeModalBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  codeModalBtnText: {
    fontSize: 14,
    letterSpacing: 2,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabLabel: {
    fontSize: 12,
    fontFamily: fonts.text.medium,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  tabLabelActive: { color: colors.primaryGlow, fontFamily: fonts.text.semiBold },
  content: { paddingHorizontal: spacing.xl },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
