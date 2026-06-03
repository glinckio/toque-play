import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import AppHeader from '../../components/AppHeader';
import TeamAvatar from '../../components/TeamAvatar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { useAuthStore } from '../../stores/authStore';
import { homeService } from '../../services/home';
import { teamService } from '../../services/team';
import { matchService, type LiveMatch } from '../../services/match';
import { useLocation } from '../../hooks/useLocation';
import { useLiveMatchesSocket } from '../../hooks/useLiveMatchesSocket';
import type { DashboardData, AcceptedFriendly } from '../../types/home';
import type { Team } from '../../types/team';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { memberCount } from '../../utils/team';

export default function HomeScreen({ onAvatarPress }: { onAvatarPress?: () => void }) {
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
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData]),
  );

  // Real-time updates for live match cards
  useLiveMatchesSocket(liveMatches, setLiveMatches);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const tournamentCount = (dashboard?.upcomingTournaments?.length ?? 0) + (dashboard?.popularTournaments?.length ?? 0);
  const teamCount = teams.length;
  const friendlyCount = dashboard?.pendingFriendlies?.length ?? 0;

  return (
    <View style={styles.root}>
      <AppHeader onAvatarPress={onAvatarPress} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Quick Stats ────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={20} color={colors.primaryGlow} />
            <Text style={styles.statValue}>{tournamentCount}</Text>
            <Text style={styles.statLabel}>TORNEIOS</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={20} color={colors.primaryGlow} />
            <Text style={styles.statValue}>{teamCount}</Text>
            <Text style={styles.statLabel}>EQUIPES</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={20} color={colors.primaryGlow} />
            <Text style={styles.statValue}>{friendlyCount}</Text>
            <Text style={styles.statLabel}>JOGOS</Text>
          </View>
        </View>

        {/* ─── Live Matches ───────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.liveDot} />
              <Text style={styles.sectionTitle}>AO VIVO</Text>
            </View>
          </View>

          {(() => {
            // Combine tournament nearby live + friendly live matches
            const friendlyLive: AcceptedFriendly[] = (dashboard?.acceptedFriendlies ?? [])
              .filter((f) => f.match?.status === 'IN_PROGRESS');
            const allLive = [
              ...liveMatches.map((m) => ({ type: 'tournament' as const, matchId: m.id, tournamentId: m.tournamentId || m.bracket?.tournamentId, teamA: m.teamA?.name ?? 'Time A', teamB: m.teamB?.name ?? 'Time B', scoreA: m.scoreTeamA, scoreB: m.scoreTeamB, sets: m.sets })),
              ...friendlyLive.map((f) => ({ type: 'friendly' as const, matchId: f.match!.id, friendlyId: f.id, teamA: f.match?.teamA?.name ?? f.requesterTeam?.name ?? 'Time A', teamB: f.match?.teamB?.name ?? f.challengedTeam?.name ?? 'Time B', scoreA: f.match?.scoreTeamA ?? 0, scoreB: f.match?.scoreTeamB ?? 0, sets: f.match?.sets ?? [] })),
            ];

            if (allLive.length === 0) {
              return (
                <View style={styles.emptySection}>
                  <Ionicons name="play-circle-outline" size={40} color={colors.textMuted} />
                  <Text style={styles.emptyText}>
                    Nenhuma partida ao vivo no momento
                  </Text>
                </View>
              );
            }

            return (
              <View style={styles.liveList}>
                {allLive.map((item) => (
                  <TouchableOpacity
                    key={item.matchId}
                    style={styles.liveCard}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.type === 'friendly') {
                        rootNav.navigate('Friendly', { screen: 'LiveMatch', params: { matchId: item.matchId } });
                      } else if (item.tournamentId) {
                        rootNav.navigate('Tournament', { screen: 'LiveMatch', params: { matchId: item.matchId, tournamentId: item.tournamentId } });
                      }
                    }}
                  >
                    <View style={styles.liveBadge}>
                      <View style={styles.liveBadgeDot} />
                      <Text style={styles.liveBadgeText}>AO VIVO</Text>
                      {item.type === 'friendly' && (
                        <Text style={[styles.liveBadgeText, { marginLeft: 4, color: colors.primaryGlow }]}>AMISTOSO</Text>
                      )}
                    </View>
                    <View style={styles.liveScoreRow}>
                      <View style={styles.liveTeam}>
                        <Text style={styles.liveTeamName} numberOfLines={1}>{item.teamA}</Text>
                      </View>
                      <View style={styles.liveScoreBlock}>
                        <Text style={styles.liveScore}>{item.scoreA}</Text>
                        <Text style={styles.liveScoreDivider}>×</Text>
                        <Text style={styles.liveScore}>{item.scoreB}</Text>
                      </View>
                      <View style={styles.liveTeam}>
                        <Text style={styles.liveTeamName} numberOfLines={1}>{item.teamB}</Text>
                      </View>
                    </View>
                    {item.sets && item.sets.length > 0 && (
                      <Text style={styles.liveSets}>
                        Sets: {item.sets.map((s) => `${s.scoreA}-${s.scoreB}`).join(' / ')}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            );
          })()}
        </View>

        {/* ─── My Teams ───────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MINHAS EQUIPES</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>CRIAR</Text>
            </TouchableOpacity>
          </View>

          {teams.length > 0 ? (
            <View style={styles.teamsList}>
              {teams.map((team) => (
                <TouchableOpacity key={team.id} style={styles.teamCard} activeOpacity={0.7}
                    onPress={() => rootNav.navigate('Team', { screen: 'TeamDetail', params: { teamId: team.id } })}
                  >
                  <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={44} />
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamMembers}>
                      {memberCount(team)} membro{memberCount(team) !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="shield-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                Crie sua primeira equipe e comece a competir
              </Text>
              <TouchableOpacity style={styles.emptyCta}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.emptyCtaGradient}
                >
                  <Ionicons name="add" size={18} color={colors.text} />
                  <Text style={styles.emptyCtaText}>CRIAR EQUIPE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ─── Upcoming Tournaments ────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PRÓXIMOS TORNEIOS</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>EXPLORAR</Text>
            </TouchableOpacity>
          </View>

          {dashboard?.upcomingTournaments && dashboard.upcomingTournaments.length > 0 ? (
            <View style={styles.tournamentList}>
              {dashboard.upcomingTournaments.map((t) => (
                <TouchableOpacity key={t.id} style={styles.tournamentCard} activeOpacity={0.7}
                    onPress={() => rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: t.id } })}
                  >
                  <View style={styles.tournamentIcon}>
                    <Ionicons name="ribbon" size={20} color={colors.primaryGlow} />
                  </View>
                  <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentName}>{t.name}</Text>
                    <Text style={styles.tournamentMeta} numberOfLines={1}>
                      {t.location || t.city} · {t.modality === 'BEACH' ? 'Areia' : 'Quadra'}
                    </Text>
                    <View style={styles.regRow}>
                      <Ionicons name="people" size={12} color={colors.primaryGlow} />
                      <Text style={styles.regCount}>
                        {t.registrationCount ?? 0} inscrito{(t.registrationCount ?? 0) !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="ribbon-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                Nenhum torneio próximo encontrado
              </Text>
            </View>
          )}
        </View>

        {/* ─── Pending Friendlies ─────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AMISTOSOS</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>VER TODOS</Text>
            </TouchableOpacity>
          </View>

          {dashboard?.pendingFriendlies && dashboard.pendingFriendlies.length > 0 ? (
            <View style={styles.tournamentList}>
              {dashboard.pendingFriendlies.map((f) => (
                <TouchableOpacity key={f.id} style={styles.tournamentCard} activeOpacity={0.7}>
                  <View style={styles.tournamentIcon}>
                    <Ionicons name="flash" size={20} color={colors.primaryGlow} />
                  </View>
                  <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentName}>
                      {f.title ?? `${f.teamAName} vs ${f.teamBName}`}
                    </Text>
                    <Text style={styles.tournamentMeta}>
                      {f.status} · {new Date(f.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="flash-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                Nenhum amistoso pendente
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function suf(n: number): string {
  return n !== 1 ? 's' : '';
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },

  // ─── Quick Stats ───────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontFamily: fonts.title.display,
    fontSize: 28,
    color: colors.text,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },

  // ─── Sections ──────────────────────────────────
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  sectionTitle: {
    fontFamily: fonts.title.display,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 2,
  },
  sectionAction: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.primaryGlow,
    fontFamily: fonts.text.semiBold,
  },

  // ─── Live Match Cards ──────────────────────────
  liveList: {
    gap: spacing.md,
  },
  liveCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,68,68,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  liveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4444',
  },
  liveBadgeText: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#FF6666',
    fontFamily: fonts.text.semiBold,
  },
  liveScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTeam: {
    flex: 1,
    alignItems: 'center',
  },
  liveTeamName: {
    fontSize: 13,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
    textAlign: 'center',
  },
  liveScoreBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  liveScore: {
    fontFamily: fonts.title.display,
    fontSize: 36,
    color: colors.text,
    letterSpacing: 1,
  },
  liveScoreDivider: {
    fontFamily: fonts.title.display,
    fontSize: 28,
    color: colors.textMuted,
  },
  liveSets: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontFamily: fonts.text.regular,
  },

  // ─── Empty States ──────────────────────────────
  emptySection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.hero,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: fonts.text.regular,
    paddingHorizontal: spacing.xl,
  },
  emptyCta: {
    marginTop: spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  emptyCtaText: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },

  // ─── Team Cards ────────────────────────────────
  teamsList: {
    gap: spacing.md,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  teamAvatarGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarInitial: {
    fontFamily: fonts.title.display,
    fontSize: 18,
    color: colors.text,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  teamMembers: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },

  // ─── Tournament / Friendly Cards ───────────────
  tournamentList: {
    gap: spacing.md,
  },
  tournamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  tournamentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(109,46,192,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  tournamentMeta: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    marginTop: 2,
  },
  regRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  regCount: {
    fontSize: 11,
    color: colors.primaryGlow,
    fontFamily: fonts.text.medium,
  },
});
