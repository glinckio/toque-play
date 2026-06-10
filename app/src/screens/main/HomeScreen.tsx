import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { opacity } from '../../theme/glow';
import { useAuthStore } from '../../stores/authStore';
import { useNotifStore } from '../../stores/notifStore';
import { homeService } from '../../services/home';
import { teamService } from '../../services/team';
import { matchService, type LiveMatch } from '../../services/match';
import { useLocation } from '../../hooks/useLocation';
import { useLiveMatchesSocket } from '../../hooks/useLiveMatchesSocket';
import type { DashboardData, AcceptedFriendly, FriendlyPreview, TournamentPreview } from '../../types/home';
import type { Team } from '../../types/team';
import type { Match } from '../../types/match';
import type { Friendly } from '../../types/friendly';
import type { Tournament } from '../../types/tournament';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { consumePreloadedHomeData } from '../../utils/homePreload';
import Section from '../../components/Section';
import QuickAction from '../../components/QuickAction';
import ChevronButton from '../../components/ChevronButton';
import MatchCard from '../../components/cards/MatchCard';
import FriendlyCard from '../../components/cards/FriendlyCard';
import TournamentCard from '../../components/cards/TournamentCard';

// ─── Adapters: convert preview/API data to card-compatible types ───

function liveMatchToMatch(lm: LiveMatch): Match {
  const tName = (lm as any).tournament?.name ?? lm.bracket?.tournament?.name;
  return {
    id: lm.id,
    bracketId: '',
    round: 0,
    position: 0,
    status: lm.status as Match['status'],
    scheduledAt: lm.startedAt ?? null,
    teamAId: lm.teamA?.id ?? null,
    teamBId: lm.teamB?.id ?? null,
    teamA: lm.teamA ? { ...lm.teamA } : null,
    teamB: lm.teamB ? { ...lm.teamB } : null,
    scoreTeamA: lm.scoreTeamA,
    scoreTeamB: lm.scoreTeamB,
    winnerId: null,
    sets: lm.sets.map((s) => ({ id: `${lm.id}-${s.setNumber}`, matchId: lm.id, ...s })),
    startedAt: lm.startedAt ?? null,
    finishedAt: null,
    group: null,
    bestOfSets: null,
    label: tName ?? null,
    refereeId: null,
  } as Match;
}

function acceptedFriendlyToMatch(af: AcceptedFriendly): Match | null {
  const m = af.match;
  if (!m) return null;
  return {
    id: m.id,
    bracketId: '',
    round: 0,
    position: 0,
    status: m.status as Match['status'],
    scheduledAt: null,
    teamAId: m.teamA?.id ?? null,
    teamBId: m.teamB?.id ?? null,
    teamA: m.teamA ? { ...m.teamA, avatarUrl: null } : null,
    teamB: m.teamB ? { ...m.teamB, avatarUrl: null } : null,
    scoreTeamA: m.scoreTeamA,
    scoreTeamB: m.scoreTeamB,
    winnerId: null,
    sets: (m.sets ?? []).map((s, i) => ({ id: `${m.id}-${i}`, matchId: m.id, ...s })),
    startedAt: null,
    finishedAt: null,
    group: null,
    bestOfSets: null,
    label: null,
    refereeId: null,
  } as Match;
}

function friendlyPreviewToCard(fp: FriendlyPreview): Friendly {
  return {
    id: fp.id,
    title: fp.title,
    description: null,
    requesterId: '',
    requesterTeamId: null,
    challengedId: null,
    challengedTeamId: null,
    status: fp.status as Friendly['status'],
    date: fp.date,
    startTime: null,
    address: null,
    addressNumber: null,
    city: null,
    state: null,
    latitude: null,
    longitude: null,
    regionRadius: null,
    scoreTeamA: null,
    scoreTeamB: null,
    modality: null,
    categoryFormat: null,
    matchId: null,
    refereeCode: null,
    createdAt: fp.date,
    updatedAt: fp.date,
    requesterTeam: { id: '', name: fp.teamAName, avatarUrl: null },
    challengedTeam: { id: '', name: fp.teamBName, avatarUrl: null },
  } as Friendly;
}

function tournamentPreviewToCard(tp: TournamentPreview): Tournament {
  return {
    id: tp.id,
    name: tp.name,
    description: null,
    eventType: 'SINGLE',
    status: 'REGISTRATION_OPEN',
    ownerId: '',
    stages: [{ id: `${tp.id}-s1`, tournamentId: tp.id, name: '', date: tp.startDate, city: tp.city, state: '' }],
    registrationCount: tp.registrationCount,
    createdAt: tp.startDate,
    updatedAt: tp.startDate,
  } as Tournament;
}

// ─── Component ────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { location } = useLocation();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [dash, teamsData, live] = await Promise.all([
        homeService.getDashboard().catch(() => null),
        teamService.findAll().catch(() => []),
        location
          ? matchService.getNearby(location.latitude, location.longitude).catch(() => [])
          : Promise.resolve([]),
      ]);
      setDashboard(dash);
      setTeams(teamsData);
      setLiveMatches(live.filter((m) => m.status === 'IN_PROGRESS'));
      useNotifStore.getState().setUnreadCount(dash?.unreadNotifications ?? 0);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      // On first focus, consume preloaded data from splash
      const preloaded = consumePreloadedHomeData();
      if (preloaded) {
        setDashboard(preloaded.dashboard);
        setTeams(preloaded.teams);
        useNotifStore.getState().setUnreadCount(preloaded.dashboard?.unreadNotifications ?? 0);
        setLoading(false);
        // Still fetch live matches in background
        if (location) {
          matchService.getNearby(location.latitude, location.longitude)
            .then((live) => setLiveMatches(live.filter((m) => m.status === 'IN_PROGRESS')))
            .catch(() => {});
        }
      } else {
        setLoading(true);
        fetchData();
      }
    }, [fetchData, location]),
  );

  useLiveMatchesSocket(liveMatches, setLiveMatches);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // ─── Derived data ───
  const allLiveMatches: Match[] = [
    ...liveMatches.map((lm) => liveMatchToMatch(lm)),
    ...((dashboard?.acceptedFriendlies ?? [])
      .filter((f) => f.match?.status === 'IN_PROGRESS')
      .map((f) => acceptedFriendlyToMatch(f))
      .filter(Boolean) as Match[]),
  ];

  const pendingFriendlies: Friendly[] = (dashboard?.pendingFriendlies ?? []).map(friendlyPreviewToCard);
  const featuredTournaments: Tournament[] = (dashboard?.upcomingTournaments ?? [])
    .slice(0, 5)
    .map(tournamentPreviewToCard);

  const firstName = user?.name?.split(' ')[0] ?? 'Atleta';

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Header ──────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.headerRounded} />

          {/* Watermark */}
          <Text style={styles.watermark} numberOfLines={1}>OLÁ</Text>

          {/* Greeting */}
          <View style={styles.greetingRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{firstName[0]}</Text>
            </View>
            <View>
              <Text style={styles.greetingSub}>Bom dia,</Text>
              <Text style={styles.greetingName}>{firstName} 👋</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickRow}>
            <QuickAction
              label="Criar Torneio"
              icon={<Ionicons name="trophy-outline" size={16} color="#FFFFFF" />}
              onPress={() => rootNav.navigate('Tournament', { screen: 'CreateTournament' })}
            />
            <QuickAction
              label="Criar Amistoso"
              icon={<Ionicons name="add" size={16} color="#FFFFFF" />}
              onPress={() => rootNav.navigate('Friendly', { screen: 'CreateFriendly' })}
            />
            <QuickAction
              label="Sou Árbitro"
              icon={<Ionicons name="people-outline" size={16} color="#FFFFFF" />}
              onPress={() => rootNav.navigate('RefereeCodeEntry')}
            />
          </View>
        </View>

        {/* ─── Content Sections ──────────────── */}
        <View style={styles.content}>
          {/* Próximos jogos */}
          <Section title="Próximos jogos" cta="Ver todos" onCta={() => rootNav.navigate('Main' as any, { screen: 'Explore' } as any)}>
            {allLiveMatches.length > 0 ? (
              <View style={styles.gapMd}>
                {allLiveMatches.slice(0, 2).map((m) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    tournamentName={m.label ?? undefined}
                    onPress={() => rootNav.navigate('Tournament', { screen: 'LiveMatch', params: { matchId: m.id } })}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="play-circle-outline" size={36} color={colors.textPlaceholder} />
                <Text style={styles.emptyText}>Nenhuma partida ao vivo</Text>
              </View>
            )}
          </Section>

          {/* Amistosos pendentes */}
          <Section title="Amistosos pendentes" cta="Ver todos" onCta={() => rootNav.navigate('Friendly', { screen: 'MyFriendlies' })}>
            {pendingFriendlies.length > 0 ? (
              <View style={styles.gapMd}>
                {pendingFriendlies.slice(0, 3).map((f) => (
                  <FriendlyCard
                    key={f.id}
                    friendly={f}
                    onPress={() => rootNav.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: f.id } })}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="flash-outline" size={36} color={colors.textPlaceholder} />
                <Text style={styles.emptyText}>Nenhum amistoso pendente</Text>
              </View>
            )}
          </Section>

          {/* Próximos torneios */}
          <Section title="Próximos torneios" cta="Explorar" onCta={() => rootNav.navigate('Main' as any, { screen: 'Explore' } as any)}>
            {featuredTournaments.length > 0 ? (
              <View style={styles.gapMd}>
                {featuredTournaments.map((t) => (
                  <TournamentCard
                    key={t.id}
                    tournament={t}
                    onPress={() => rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: t.id } })}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="ribbon-outline" size={36} color={colors.textPlaceholder} />
                <Text style={styles.emptyText}>Nenhum torneio encontrado</Text>
              </View>
            )}
          </Section>

          {/* Referee promo card */}
          <View style={styles.refCard}>
            <LinearGradient
              colors={[colors.dark, colors.darkSecondary]}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.refTitle}>VAI ARBITRAR{'\n'}UMA PARTIDA?</Text>
            <Text style={styles.refSubtitle}>
              Insira o código de 6 dígitos para começar.
            </Text>
            <View style={{ marginTop: spacing.lg }}>
              <ChevronButton variant="primary" size="md" onPress={() => rootNav.navigate('RefereeCodeEntry')}>
                Inserir código
              </ChevronButton>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ─── Header ────────────────────────────────────
  header: {
    paddingBottom: 48,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRounded: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.section,
    borderTopRightRadius: radius.section,
  },
  watermark: {
    position: 'absolute',
    right: -6,
    top: 20,
    fontFamily: fonts.title.regular,
    fontSize: 140,
    color: '#FFFFFF',
    opacity: opacity.watermark,
    letterSpacing: 2,
    lineHeight: 140,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.xl,
    paddingTop: 28,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.subtitle,
    color: '#FFFFFF',
  },
  greetingSub: {
    fontFamily: fonts.text.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  greetingName: {
    fontFamily: fonts.title.regular,
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  quickRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginTop: 24,
    gap: 10,
  },

  // ─── Content ───────────────────────────────────
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.section,
  },
  gapMd: {
    gap: spacing.md,
  },

  // ─── Empty States ──────────────────────────────
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // ─── Referee Promo ─────────────────────────────
  refCard: {
    borderRadius: radius.card,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  refTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  refSubtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.sm,
  },
});
