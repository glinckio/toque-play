import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  ActivityIndicator, StyleSheet, FlatList, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/authStore';
import { useLiveMatchStore } from '../../stores/matchStore';
import { friendlyService } from '../../services/friendly';
import { teamService } from '../../services/team';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import type { Friendly, FriendlyAthlete } from '../../types/friendly';
import { FriendlyStatus, FRIENDLY_STATUS_LABELS } from '../../types/friendly';
import TeamAvatar from '../../components/TeamAvatar';
import HeroHeader from '../../components/HeroHeader';
import StatusBadge from '../../components/StatusBadge';
import ChevronButton from '../../components/ChevronButton';
import { useDialogStore } from '../../stores/dialogStore';

const LIVE_COLOR = '#E04545';

function getCategoryMax(cat: string | null | undefined) {
  switch (cat) {
    case 'DUO': case 'PAIR': return 2;
    case 'QUARTET': return 4;
    case 'SEXTET': return 6;
    default: return 0;
  }
}

export default function FriendlyDetailScreen({ route, navigation }: any) {
  const { friendlyId } = route.params;
  const user = useAuthStore((s) => s.user);
  const rootNav = useNavigation<any>();
  const dialog = useDialogStore();

  const [friendly, setFriendly] = useState<Friendly | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Accept form
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [acceptMembers, setAcceptMembers] = useState<any[]>([]);
  const [acceptAthletes, setAcceptAthletes] = useState<Set<string>>(new Set());
  const [acceptCaptainId, setAcceptCaptainId] = useState<string | null>(null);
  const [loadingAcceptMembers, setLoadingAcceptMembers] = useState(false);

  // Athletes popup
  const [athletesSide, setAthletesSide] = useState<'REQUESTER' | 'CHALLENGED' | null>(null);

  // Pulse animation for live
  const pulse = useRef(new Animated.Value(0)).current;
  const pulseRunning = useRef(true);

  const loadFriendly = useCallback(() => {
    setLoading(true);
    friendlyService.findOne(friendlyId)
      .then(setFriendly)
      .catch(() => setFriendly(null))
      .finally(() => setLoading(false));
  }, [friendlyId]);

  useFocusEffect(useCallback(() => { loadFriendly(); }, [loadFriendly]));

  // Join live match socket when friendly is in progress
  const { match: liveMatchData, joinMatch, leaveMatch } = useLiveMatchStore();
  useEffect(() => {
    if (friendly?.match?.id && friendly.match.status === 'IN_PROGRESS') {
      joinMatch(friendly.match as any);
    }
    return () => { leaveMatch(); };
  }, [friendly?.match?.id, friendly?.match?.status]);

  // Merge live socket data into friendly display
  const displayFriendly = useMemo(() => {
    if (!friendly || !liveMatchData || friendly.match?.id !== liveMatchData.id) return friendly;
    return {
      ...friendly,
      match: {
        ...friendly.match,
        scoreTeamA: liveMatchData.scoreTeamA,
        scoreTeamB: liveMatchData.scoreTeamB,
        sets: liveMatchData.sets,
        status: liveMatchData.status,
      },
    };
  }, [friendly, liveMatchData]);

  useEffect(() => {
    if (friendly?.status === FriendlyStatus.ACCEPTED && friendly?.match?.status === 'IN_PROGRESS') {
      pulseRunning.current = true;
      const animate = () => {
        if (!pulseRunning.current) return;
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1, duration: 1300, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 1300, useNativeDriver: true }),
        ]).start(({ finished }) => { if (finished) animate(); });
      };
      animate();
    }
    return () => { pulseRunning.current = false; pulse.stopAnimation(); };
  }, [friendly?.status, friendly?.match?.status]);

  useEffect(() => {
    if (showAcceptForm && friendly?.challengedTeamId) {
      setLoadingAcceptMembers(true);
      teamService.findOne(displayFriendly.challengedTeamId)
        .then((team) => setAcceptMembers(team.members ?? []))
        .catch(() => setAcceptMembers([]))
        .finally(() => setLoadingAcceptMembers(false));
    }
  }, [showAcceptForm, friendly?.challengedTeamId]);

  const isChallenged = displayFriendly?.challengedId === user?.id;
  const isRequester = displayFriendly?.requesterId === user?.id;
  const canRespond = isChallenged && displayFriendly?.status === FriendlyStatus.PENDING;
  const canCancel = isRequester && (displayFriendly?.status === FriendlyStatus.PENDING || displayFriendly?.status === FriendlyStatus.ACCEPTED);
  const isLive = displayFriendly?.status === FriendlyStatus.ACCEPTED && displayFriendly?.match?.status === 'IN_PROGRESS';
  const isTeamMember = !!(
    user &&
    displayFriendly?.athletes?.some((a) => a.teamMember?.user?.id === user.id)
  ) || isRequester || isChallenged;
  const canWatchLive = isLive && displayFriendly?.match?.id && (isTeamMember || isRequester || isChallenged);

  const toggleAcceptAthlete = (memberId: string) => {
    const max = getCategoryMax(displayFriendly?.categoryFormat);
    setAcceptAthletes((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
        if (acceptCaptainId === memberId) setAcceptCaptainId(null);
      } else {
        if (max > 0 && next.size >= max) return prev;
        next.add(memberId);
      }
      return next;
    });
  };

  const handleAccept = async () => {
    if (!displayFriendly) return;
    const max = getCategoryMax(displayFriendly.categoryFormat);
    if (max > 0 && acceptAthletes.size !== max) {
      dialog.warning(`Selecione exatamente ${max} jogador${max > 1 ? 'es' : ''}.`);
      return;
    }
    setActionLoading(true);
    try {
      await friendlyService.accept(displayFriendly.id, Array.from(acceptAthletes), acceptCaptainId ?? undefined);
      loadFriendly();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível aceitar.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível aceitar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = async (action: 'reject' | 'cancel') => {
    if (!displayFriendly) return;
    setActionLoading(true);
    try {
      await friendlyService[action](displayFriendly.id);
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível realizar a ação.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível realizar a ação.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!friendly) return;
    setActionLoading(true);
    try {
      await friendlyService.generateRefereeCode(displayFriendly.id);
      loadFriendly();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível gerar o código.';
      dialog.error(typeof msg === 'string' ? msg : 'Não foi possível gerar o código.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const formatTime = (d: string | null) => d ? new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;

  if (loading) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <HeroHeader title="AMISTOSO" watermark="MATCH" onBack={() => navigation.goBack()} rounded />
        <View style={s.center}><ActivityIndicator color={colors.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  if (!displayFriendly) {
    return (
      <SafeAreaView style={s.root} edges={['top']}>
        <HeroHeader title="AMISTOSO" watermark="MATCH" onBack={() => navigation.goBack()} rounded />
        <View style={s.center}>
          <Ionicons name="flash-outline" size={48} color={colors.textPlaceholder} />
          <Text style={s.emptyText}>Amistoso não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const nameA = displayFriendly.requesterTeam?.name ?? 'Time A';
  const nameB = displayFriendly.challengedTeam?.name ?? 'A definir';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <HeroHeader
        title={(displayFriendly.title ?? 'AMISTOSO').toUpperCase()}
        watermark="VS"
        subtitle={`${nameA} vs ${nameB}`}
        onBack={() => navigation.goBack()}
        rounded
      />

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {/* Status */}
        <View style={s.statusRow}>
          {isLive ? (
            <View style={s.liveBadge}>
              <Animated.View
                style={[s.liveGlow, { opacity: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.8, 0.1] }) }]}
              />
              <Text style={s.liveText}>AO VIVO</Text>
            </View>
          ) : (
            <StatusBadge status={displayFriendly.status} />
          )}
        </View>

        {/* Teams VS */}
        <View style={s.teamsRow}>
          <View style={s.teamCol}>
            <View style={s.teamCircleWrap}>
              <TeamAvatar avatarUrl={displayFriendly.requesterTeam?.avatarUrl} name={nameA} size={56} />
              {displayFriendly.athletes && displayFriendly.athletes.some((a) => a.side === 'REQUESTER') && (
                <TouchableOpacity style={s.athletesBtn} onPress={() => setAthletesSide('REQUESTER')} activeOpacity={0.7}>
                  <Ionicons name="people" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={s.teamName} numberOfLines={1}>{nameA}</Text>
          </View>

          <Text style={s.vs}>VS</Text>

          <View style={s.teamCol}>
            <View style={s.teamCircleWrap}>
              <TeamAvatar avatarUrl={displayFriendly.challengedTeam?.avatarUrl} name={nameB} size={56} />
              {displayFriendly.athletes && displayFriendly.athletes.some((a) => a.side === 'CHALLENGED') && (
                <TouchableOpacity style={s.athletesBtn} onPress={() => setAthletesSide('CHALLENGED')} activeOpacity={0.7}>
                  <Ionicons name="people" size={12} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={s.teamName} numberOfLines={1}>{nameB}</Text>
          </View>
        </View>

        {/* Winner badge */}
        {displayFriendly.status === FriendlyStatus.COMPLETED && displayFriendly.match?.winnerId && (
          <View style={s.winnerBadge}>
            <Ionicons name="trophy" size={18} color="#FFD700" />
            <Text style={s.winnerText}>
              Vencedor: {displayFriendly.match.winnerId === displayFriendly.requesterTeamId ? nameA : nameB}
            </Text>
          </View>
        )}

        {/* Sets for completed */}
        {displayFriendly.status === FriendlyStatus.COMPLETED && displayFriendly.match?.sets && displayFriendly.match.sets.length > 0 && (() => {
          const sets = displayFriendly.match.sets;
          const wonA = sets.filter((set) => set.scoreA > set.scoreB).length;
          const wonB = sets.filter((set) => set.scoreB > set.scoreA).length;
          return (
            <View style={s.setsCard}>
              <Text style={s.setsTitle}>SETS</Text>
              <View style={s.setsSummaryRow}>
                <View style={s.setsSummaryCol}>
                  <Text style={s.setsSummaryName} numberOfLines={1}>{nameA}</Text>
                  <Text style={[s.setsSummaryCount, wonA > wonB && s.setsWinner]}>{wonA}</Text>
                </View>
                <Text style={s.setsDivider}>×</Text>
                <View style={s.setsSummaryCol}>
                  <Text style={s.setsSummaryName} numberOfLines={1}>{nameB}</Text>
                  <Text style={[s.setsSummaryCount, wonB > wonA && s.setsWinner]}>{wonB}</Text>
                </View>
              </View>
              {sets.map((set) => (
                <View key={set.id} style={s.setRow}>
                  <Text style={[s.setScore, set.scoreA > set.scoreB && s.setScoreWin]}>{set.scoreA}</Text>
                  <Text style={s.setLabel}>Set {set.setNumber}</Text>
                  <Text style={[s.setScore, set.scoreB > set.scoreA && s.setScoreWin]}>{set.scoreB}</Text>
                </View>
              ))}
            </View>
          );
        })()}

        {/* Info card */}
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={s.infoText}>{formatDate(displayFriendly.date)}{formatTime(displayFriendly.startTime) ? ` às ${formatTime(displayFriendly.startTime)}` : ''}</Text>
          </View>
          {displayFriendly.address && (
            <View style={s.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={s.infoText}>{displayFriendly.address}{displayFriendly.city ? `, ${displayFriendly.city}` : ''}{displayFriendly.state ? ` - ${displayFriendly.state}` : ''}</Text>
            </View>
          )}
          {(displayFriendly.modality || displayFriendly.categoryFormat) && (
            <View style={s.infoRow}>
              <Ionicons name={displayFriendly.modality === 'BEACH' ? 'sunny-outline' : 'fitness-outline'} size={18} color={colors.primary} />
              <Text style={s.infoText}>
                {displayFriendly.modality === 'BEACH' ? 'Areia' : displayFriendly.modality === 'COURT' ? 'Quadra' : ''}
                {displayFriendly.modality && displayFriendly.categoryFormat ? ' · ' : ''}
                {displayFriendly.categoryFormat === 'PAIR' ? 'Dupla' : displayFriendly.categoryFormat === 'QUARTET' ? 'Quarteto' : displayFriendly.categoryFormat === 'SEXTET' ? 'Sexteto' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Accepted actions */}
        {displayFriendly.status === FriendlyStatus.ACCEPTED && (
          <View style={s.acceptedSection}>
            {canWatchLive && (
              <ChevronButton
                variant="danger"
                size="lg"
                fullWidth
                onPress={() => rootNav.navigate('Friendly', { screen: 'LiveMatch', params: { matchId: displayFriendly.match!.id } })}
                icon={<Ionicons name="eye" size={16} color="#FFFFFF" />}
              >
                ACOMPANHAR PARTIDA
              </ChevronButton>
            )}

            {(isRequester || isChallenged) && (
              displayFriendly.refereeCode ? (
                <View style={s.codeCard}>
                  <Ionicons name="key-outline" size={24} color={colors.primary} />
                  <Text style={s.codeLabel}>CÓDIGO DE ACESSO</Text>
                  <Text style={s.codeValue}>{displayFriendly.refereeCode}</Text>
                  <Text style={s.codeHint}>
                    Compartilhe este código com o árbitro para que ele possa apitar a partida.
                  </Text>
                </View>
              ) : (
                <ChevronButton
                  variant="ghost"
                  size="lg"
                  fullWidth
                  onPress={handleGenerateCode}
                  disabled={actionLoading}
                  icon={<Ionicons name="key-outline" size={16} color={colors.primary} />}
                >
                  {actionLoading ? 'GERANDO...' : 'GERAR CÓDIGO DE ACESSO'}
                </ChevronButton>
              )
            )}

            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => rootNav.navigate('RefereeCodeEntry', { mode: 'friendly' })}
              icon={<Ionicons name="flag-outline" size={16} color="#FFFFFF" />}
            >
              ENTRAR COMO ÁRBITRO
            </ChevronButton>
          </View>
        )}

        {/* Accept form */}
        {canRespond && showAcceptForm && (
          <View style={s.acceptFormCard}>
            <Text style={s.acceptFormTitle}>
              SELECIONE SEUS JOGADORES ({acceptAthletes.size}/{getCategoryMax(displayFriendly.categoryFormat)})
            </Text>
            {loadingAcceptMembers ? (
              <ActivityIndicator color={colors.primary} size="small" style={{ marginVertical: spacing.md }} />
            ) : (
              acceptMembers.map((member: any) => {
                const isSelected = acceptAthletes.has(member.id);
                const isCap = acceptCaptainId === member.id;
                const name = member.user?.name ?? member.guestName ?? '?';
                return (
                  <View key={member.id} style={[s.athleteCard, isSelected && s.athleteCardActive]}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => toggleAcceptAthlete(member.id)} activeOpacity={0.7}>
                      <View style={[s.checkCircle, isSelected && s.checkCircleActive]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </View>
                      <View style={s.athleteInfo}>
                        <Text style={[s.athleteName, isSelected && s.athleteNameActive]} numberOfLines={1}>{name}</Text>
                        {member.isCaptain && <Text style={s.capBadge}>CAP</Text>}
                        {member.isGuest && <Text style={s.guestBadge}>CONVIDADO</Text>}
                      </View>
                    </TouchableOpacity>
                    {isSelected && (
                      <TouchableOpacity onPress={() => setAcceptCaptainId(isCap ? null : member.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name={isCap ? 'star' : 'star-outline'} size={18} color={isCap ? '#FFD700' : colors.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
            <View style={s.acceptFormActions}>
              <TouchableOpacity style={s.cancelActionBtn} onPress={() => { setShowAcceptForm(false); setAcceptAthletes(new Set()); }} activeOpacity={0.8}>
                <Text style={s.cancelActionText}>CANCELAR</Text>
              </TouchableOpacity>
              <ChevronButton
                variant="primary"
                size="md"
                onPress={handleAccept}
                disabled={actionLoading || acceptAthletes.size === 0}
              >
                {actionLoading ? 'CONFIRMANDO...' : 'CONFIRMAR'}
              </ChevronButton>
            </View>
          </View>
        )}

        {/* Actions */}
        {(canRespond || canCancel) && !showAcceptForm && (
          <View style={s.actions}>
            {canRespond && (
              <View style={s.actionsRow}>
                <View style={{ flex: 1 }}>
                  <ChevronButton
                    variant="success"
                    size="lg"
                    fullWidth
                    onPress={() => setShowAcceptForm(true)}
                    disabled={actionLoading}
                  >
                    ACEITAR
                  </ChevronButton>
                </View>
                <View style={{ flex: 1 }}>
                  <ChevronButton
                    variant="danger"
                    size="lg"
                    fullWidth
                    onPress={() => handleAction('reject')}
                    disabled={actionLoading}
                  >
                    RECUSAR
                  </ChevronButton>
                </View>
              </View>
            )}
            {canCancel && (
              <TouchableOpacity style={s.cancelFullBtn} onPress={() => handleAction('cancel')} disabled={actionLoading} activeOpacity={0.8}>
                <Text style={s.cancelFullText}>CANCELAR AMISTOSO</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Athletes popup */}
      <Modal visible={!!athletesSide} animationType="fade" transparent onRequestClose={() => setAthletesSide(null)}>
        <TouchableOpacity style={s.athletesOverlay} activeOpacity={1} onPress={() => setAthletesSide(null)}>
          <View style={s.athletesModal} onStartShouldSetResponder={() => true}>
            <View style={s.athletesModalHeader}>
              <Text style={s.athletesModalTitle}>
                {athletesSide === 'REQUESTER' ? nameA : nameB}
              </Text>
              <TouchableOpacity onPress={() => setAthletesSide(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={displayFriendly.athletes?.filter((a) => a.side === athletesSide) ?? []}
              keyExtractor={(item) => item.id}
              renderItem={({ item: athlete }) => (
                <View style={s.athleteModalItem}>
                  <View style={s.athleteModalAvatar}>
                    <Text style={s.athleteModalInitial}>
                      {(athlete.teamMember?.user?.name ?? athlete.teamMember?.guestName ?? '?').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={s.athleteModalInfo}>
                    <Text style={s.athleteModalName} numberOfLines={1}>
                      {athlete.teamMember?.user?.name ?? athlete.teamMember?.guestName ?? '?'}
                    </Text>
                    {athlete.isCaptain && <Text style={s.capBadge}>CAPITÃO</Text>}
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={s.athletesModalEmpty}>Nenhum atleta informado</Text>}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  emptyText: { fontSize: typography.sizes.input, color: colors.textMuted, fontFamily: fonts.text.regular },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  statusRow: { marginTop: spacing.lg, marginBottom: spacing.md },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(224,69,69,0.1)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  liveGlow: { width: 12, height: 12, borderRadius: 6, backgroundColor: LIVE_COLOR },
  liveText: { fontFamily: fonts.title.regular, fontSize: typography.sizes.md, color: LIVE_COLOR, letterSpacing: typography.letterSpacing.extraWide },

  // Teams VS
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: spacing.xxl },
  teamCol: { alignItems: 'center', flex: 1 },
  teamCircleWrap: { position: 'relative', marginBottom: spacing.md },
  teamName: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.text, textAlign: 'center' },
  vs: { fontSize: typography.sizes.display, fontFamily: fonts.title.regular, color: colors.primary, marginHorizontal: spacing.md },
  athletesBtn: {
    position: 'absolute', bottom: -4, right: -4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.background,
  },

  // Winner
  winnerBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: radius.lg, paddingVertical: spacing.md, marginBottom: spacing.lg },
  winnerText: { fontSize: typography.sizes.input, fontFamily: fonts.text.bold, color: '#FFD700' },

  // Sets
  setsCard: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.lg, marginBottom: spacing.xxl,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  setsTitle: { fontSize: typography.sizes.heading, fontFamily: fonts.title.regular, color: colors.text, marginBottom: spacing.md, textAlign: 'center', letterSpacing: typography.letterSpacing.medium },
  setsSummaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, gap: spacing.lg },
  setsSummaryCol: { alignItems: 'center', flex: 1 },
  setsSummaryName: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.text, textAlign: 'center' },
  setsSummaryCount: { fontSize: typography.sizes.hero, fontFamily: fonts.title.regular, color: colors.textMuted },
  setsWinner: { color: colors.primary },
  setsDivider: { fontSize: typography.sizes.display, fontFamily: fonts.title.regular, color: colors.textMuted },
  setRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: 4 },
  setScore: { fontSize: typography.sizes.subtitle, fontFamily: fonts.title.regular, color: colors.textMuted, minWidth: 30, textAlign: 'center' },
  setScoreWin: { color: colors.primary },
  setLabel: { fontSize: typography.sizes.md, fontFamily: fonts.text.medium, color: colors.textSecondary },

  // Info card
  infoCard: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.lg, gap: spacing.md, marginBottom: spacing.xxl,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoText: { fontSize: typography.sizes.input, fontFamily: fonts.text.regular, color: colors.text, flex: 1 },

  // Accepted section
  acceptedSection: { gap: spacing.md, marginBottom: spacing.xxl },
  codeCard: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    borderWidth: 1, borderColor: colors.primary,
    padding: spacing.xl, alignItems: 'center',
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  codeLabel: { fontSize: typography.sizes.md, fontFamily: fonts.text.medium, color: colors.textMuted, marginTop: spacing.sm, letterSpacing: typography.letterSpacing.medium },
  codeValue: { fontSize: typography.sizes.hero, fontFamily: fonts.title.regular, color: colors.primary, letterSpacing: 6 },
  codeHint: { fontSize: typography.sizes.md, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 16 },

  // Accept form
  acceptFormCard: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.xl, marginBottom: spacing.xxl,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  acceptFormTitle: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.text, marginBottom: spacing.md, letterSpacing: typography.letterSpacing.medium },
  athleteCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.backgroundSecondary, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: 'transparent',
  },
  athleteCardActive: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textPlaceholder, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  checkCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  athleteInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  athleteName: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.text },
  athleteNameActive: { color: colors.primary },
  capBadge: { fontSize: 11, fontFamily: fonts.text.bold, color: '#FFD700', backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, letterSpacing: 1 },
  guestBadge: { fontSize: 11, fontFamily: fonts.text.bold, color: colors.textMuted, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, letterSpacing: 1 },
  acceptFormActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md, marginTop: spacing.md },
  cancelActionBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  cancelActionText: { fontFamily: fonts.text.semiBold, fontSize: typography.sizes.md, color: colors.textMuted },

  // Actions
  actions: { gap: spacing.md, marginTop: spacing.xl },
  actionsRow: { flexDirection: 'row', gap: spacing.md },
  cancelFullBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: spacing.lg, borderRadius: radius.lg,
    backgroundColor: 'rgba(224,69,69,0.08)',
  },
  cancelFullText: { fontFamily: fonts.text.semiBold, fontSize: typography.sizes.input, color: colors.error },

  // Athletes overlay
  athletesOverlay: { flex: 1, backgroundColor: 'rgba(20,10,30,0.5)', justifyContent: 'center', alignItems: 'center' },
  athletesModal: {
    backgroundColor: colors.surface, borderRadius: radius.section,
    width: '85%', maxHeight: '60%', padding: spacing.xxl,
  },
  athletesModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  athletesModalTitle: { fontSize: typography.sizes.button, fontFamily: fonts.text.bold, color: colors.text, flex: 1 },
  athleteModalItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.backgroundSecondary, borderRadius: radius.lg,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  athleteModalAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  athleteModalInitial: { fontSize: typography.sizes.subtitle, fontFamily: fonts.title.regular, color: colors.primary },
  athleteModalInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  athleteModalName: { fontSize: typography.sizes.input, fontFamily: fonts.text.semiBold, color: colors.text },
  athletesModalEmpty: { fontSize: typography.sizes.body, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
});
