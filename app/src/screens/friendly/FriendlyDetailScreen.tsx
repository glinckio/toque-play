import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  ActivityIndicator, Alert, StyleSheet, FlatList, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../stores/authStore';
import { friendlyService } from '../../services/friendly';
import { teamService } from '../../services/team';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { Friendly, FriendlyAthlete } from '../../types/friendly';
import { FriendlyStatus, FRIENDLY_STATUS_LABELS } from '../../types/friendly';
import TeamAvatar from '../../components/TeamAvatar';

const STATUS_COLORS: Record<FriendlyStatus, string> = {
  [FriendlyStatus.PENDING]: '#FF9800',
  [FriendlyStatus.ACCEPTED]: '#4CAF50',
  [FriendlyStatus.REJECTED]: colors.error,
  [FriendlyStatus.CANCELLED]: colors.textMuted,
  [FriendlyStatus.COMPLETED]: colors.primaryGlow,
};

const LIVE_COLOR = '#FF4444';

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

  const loadFriendly = () => {
    setLoading(true);
    friendlyService.findOne(friendlyId)
      .then(setFriendly)
      .catch(() => setFriendly(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFriendly(); }, [friendlyId]);

  useFocusEffect(useCallback(() => { loadFriendly(); }, [loadFriendly]));

  // Pulse for live
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

  // Load accept form members
  useEffect(() => {
    if (showAcceptForm && friendly?.challengedTeamId) {
      setLoadingAcceptMembers(true);
      teamService.findOne(friendly.challengedTeamId)
        .then((team) => setAcceptMembers(team.members ?? []))
        .catch(() => setAcceptMembers([]))
        .finally(() => setLoadingAcceptMembers(false));
    }
  }, [showAcceptForm, friendly?.challengedTeamId]);

  const isChallenged = friendly?.challengedId === user?.id;
  const isRequester = friendly?.requesterId === user?.id;
  const canRespond = isChallenged && friendly?.status === FriendlyStatus.PENDING;
  const canCancel = isRequester && (friendly?.status === FriendlyStatus.PENDING || friendly?.status === FriendlyStatus.ACCEPTED);

  const isLive = friendly?.status === FriendlyStatus.ACCEPTED && friendly?.match?.status === 'IN_PROGRESS';
  const statusLabel = isLive ? 'AO VIVO' : (friendly ? FRIENDLY_STATUS_LABELS[friendly.status] : '');
  const statusColor = isLive ? LIVE_COLOR : (friendly ? STATUS_COLORS[friendly.status] : colors.textMuted);

  // Check if user is member of either team (via athletes list)
  const isTeamMember = !!(
    user &&
    friendly?.athletes?.some(
      (a) => a.teamMember?.user?.id === user.id
    )
  ) || isRequester || isChallenged;

  // Can watch live match: any team member
  const canWatchLive = isLive && friendly?.match?.id && (isTeamMember || isRequester || isChallenged);

  const toggleAcceptAthlete = (memberId: string) => {
    const max = getCategoryMax(friendly?.categoryFormat);
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
    if (!friendly) return;
    const max = getCategoryMax(friendly.categoryFormat);
    if (max > 0 && acceptAthletes.size !== max) {
      Alert.alert('Atenção', `Selecione exatamente ${max} jogador${max > 1 ? 'es' : ''}.`);
      return;
    }
    setActionLoading(true);
    try {
      await friendlyService.accept(friendly.id, Array.from(acceptAthletes), acceptCaptainId ?? undefined);
      loadFriendly();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Não foi possível aceitar.';
      console.error('Accept error:', JSON.stringify(e?.response?.data || e));
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível aceitar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = async (action: 'reject' | 'cancel') => {
    if (!friendly) return;
    setActionLoading(true);
    try {
      await friendlyService[action](friendly.id);
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível realizar a ação.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível realizar a ação.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!friendly) return;
    setActionLoading(true);
    try {
      await friendlyService.generateRefereeCode(friendly.id);
      loadFriendly();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Não foi possível gerar o código.';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Não foi possível gerar o código.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  const formatTime = (d: string | null) => d ? new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;

  if (loading) {
    return (
      <View style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>AMISTOSO</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.center}><ActivityIndicator color={colors.primary} size="large" /></View>
      </View>
    );
  }

  if (!friendly) {
    return (
      <View style={s.root}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>AMISTOSO</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.center}>
          <Ionicons name="flash-outline" size={48} color={colors.textMuted} />
          <Text style={s.emptyText}>Amistoso não encontrado</Text>
        </View>
      </View>
    );
  }

  const nameA = friendly.requesterTeam?.name ?? 'Time A';
  const nameB = friendly.challengedTeam?.name ?? 'A definir';

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>AMISTOSO</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {/* Status */}
        <View style={[s.statusBadge, { backgroundColor: statusColor + '22' }]}>
          {isLive && (
            <View style={s.liveDotWrap}>
              <Animated.View
                style={[s.liveDotGlow, { opacity: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 0.8, 0.1] }) }]}
              />
            </View>
          )}
          <View style={[s.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[s.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>

        {/* Title */}
        {friendly.title && <Text style={s.title}>{friendly.title}</Text>}

        {/* Teams VS */}
        <View style={s.teamsRow}>
          <View style={s.teamCol}>
            <View style={s.teamCircleWrap}>
              <TeamAvatar avatarUrl={friendly.requesterTeam?.avatarUrl} name={nameA} size={56} />
              {friendly.athletes && friendly.athletes.some((a) => a.side === 'REQUESTER') && (
                <TouchableOpacity style={s.athletesBtn} onPress={() => setAthletesSide('REQUESTER')} activeOpacity={0.7}>
                  <Ionicons name="people" size={12} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={s.teamName} numberOfLines={1}>{nameA}</Text>
          </View>

          <Text style={s.vs}>VS</Text>

          <View style={s.teamCol}>
            <View style={s.teamCircleWrap}>
              <TeamAvatar avatarUrl={friendly.challengedTeam?.avatarUrl} name={nameB} size={56} />
              {friendly.athletes && friendly.athletes.some((a) => a.side === 'CHALLENGED') && (
                <TouchableOpacity style={s.athletesBtn} onPress={() => setAthletesSide('CHALLENGED')} activeOpacity={0.7}>
                  <Ionicons name="people" size={12} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={s.teamName} numberOfLines={1}>{nameB}</Text>
          </View>
        </View>

        {/* Winner badge */}
        {friendly.status === FriendlyStatus.COMPLETED && friendly.match?.winnerId && (
          <View style={s.winnerBadge}>
            <Ionicons name="trophy" size={18} color="#FFD700" />
            <Text style={s.winnerText}>
              Vencedor: {friendly.match.winnerId === friendly.requesterTeamId ? nameA : nameB}
            </Text>
          </View>
        )}

        {/* Sets for completed */}
        {friendly.status === FriendlyStatus.COMPLETED && friendly.match?.sets && friendly.match.sets.length > 0 && (() => {
          const sets = friendly.match.sets;
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
            <Ionicons name="calendar-outline" size={18} color={colors.primaryGlow} />
            <Text style={s.infoText}>{formatDate(friendly.date)}{formatTime(friendly.startTime) ? ` às ${formatTime(friendly.startTime)}` : ''}</Text>
          </View>
          {friendly.address && (
            <View style={s.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.primaryGlow} />
              <Text style={s.infoText}>{friendly.address}{friendly.city ? `, ${friendly.city}` : ''}{friendly.state ? ` - ${friendly.state}` : ''}</Text>
            </View>
          )}
          {(friendly.modality || friendly.categoryFormat) && (
            <View style={s.infoRow}>
              <Ionicons name={friendly.modality === 'BEACH' ? 'sunny-outline' : 'fitness-outline'} size={18} color={colors.primaryGlow} />
              <Text style={s.infoText}>
                {friendly.modality === 'BEACH' ? 'Areia' : friendly.modality === 'COURT' ? 'Quadra' : ''}
                {friendly.modality && friendly.categoryFormat ? ' · ' : ''}
                {friendly.categoryFormat === 'PAIR' ? 'Dupla' : friendly.categoryFormat === 'QUARTET' ? 'Quarteto' : friendly.categoryFormat === 'SEXTET' ? 'Sexteto' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Accepted actions: referee code */}
        {friendly.status === FriendlyStatus.ACCEPTED && (
          <View style={s.acceptedSection}>
            {/* Watch live match button — visible to any team member */}
            {canWatchLive && (
              <TouchableOpacity
                style={s.watchLiveBtn}
                onPress={() => rootNav.navigate('Friendly', { screen: 'LiveMatch', params: { matchId: friendly.match!.id } })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[LIVE_COLOR, '#FF8A80']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.watchLiveGradient}
                >
                  <Ionicons name="eye" size={20} color="#FFF" />
                  <Text style={s.watchLiveText}>ACOMPANHAR PARTIDA</Text>
                  <View style={s.watchLivePulse} />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {(isRequester || isChallenged) && (
              friendly.refereeCode ? (
                <View style={s.codeDisplayCard}>
                  <View style={s.codeDisplayIcon}>
                    <Ionicons name="key-outline" size={24} color={colors.primaryGlow} />
                  </View>
                  <Text style={s.codeDisplayLabel}>CÓDIGO DE ACESSO</Text>
                  <Text style={s.codeDisplayValue}>{friendly.refereeCode}</Text>
                  <Text style={s.codeDisplayHint}>
                    Compartilhe este código com o árbitro para que ele possa apitar a partida.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity style={s.refereeBtn} onPress={handleGenerateCode} disabled={actionLoading} activeOpacity={0.8}>
                  {actionLoading ? (
                    <ActivityIndicator color={colors.primaryGlow} size="small" />
                  ) : (
                    <>
                      <Ionicons name="key-outline" size={20} color={colors.primaryGlow} />
                      <Text style={s.refereeBtnText}>GERAR CÓDIGO DE ACESSO</Text>
                    </>
                  )}
                </TouchableOpacity>
              )
            )}

            <TouchableOpacity style={s.enterCodeBtn} onPress={() => rootNav.navigate('RefereeCodeEntry', { mode: 'friendly' })} activeOpacity={0.8}>
              <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.enterCodeGradient}>
                <Ionicons name="flag-outline" size={18} color={colors.text} />
                <Text style={s.enterCodeText}>ENTRAR COMO ÁRBITRO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Accept form */}
        {canRespond && showAcceptForm && (
          <View style={s.acceptFormCard}>
            <Text style={s.acceptFormTitle}>
              SELECIONE SEUS JOGADORES ({acceptAthletes.size}/{getCategoryMax(friendly.categoryFormat)})
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
                        {isSelected && <Ionicons name="checkmark" size={14} color={colors.text} />}
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
              <TouchableOpacity style={[s.actionBtn, s.cancelActionBtn]} onPress={() => { setShowAcceptForm(false); setAcceptAthletes(new Set()); }} activeOpacity={0.8}>
                <Text style={s.cancelActionText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.confirmBtn, (actionLoading || acceptAthletes.size === 0) && s.confirmBtnDisabled]}
                onPress={handleAccept}
                disabled={actionLoading || acceptAthletes.size === 0}
                activeOpacity={0.8}
              >
                {actionLoading ? <ActivityIndicator color={colors.text} /> : <Text style={s.confirmText}>CONFIRMAR</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Actions */}
        {(canRespond || canCancel) && !showAcceptForm && (
          <View style={s.actions}>
            {canRespond && (
              <View style={s.actionsRow}>
                <TouchableOpacity style={[s.actionBtn, s.acceptBtn]} onPress={() => setShowAcceptForm(true)} disabled={actionLoading} activeOpacity={0.8}>
                  <Text style={s.acceptText}>ACEITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.actionBtn, s.rejectBtn]} onPress={() => handleAction('reject')} disabled={actionLoading} activeOpacity={0.8}>
                  <Text style={s.rejectText}>RECUSAR</Text>
                </TouchableOpacity>
              </View>
            )}
            {canCancel && (
              <TouchableOpacity style={[s.actionBtn, s.cancelActionBtn]} onPress={() => handleAction('cancel')} disabled={actionLoading} activeOpacity={0.8}>
                {actionLoading ? <ActivityIndicator color={colors.textMuted} /> : <Text style={s.cancelActionText}>CANCELAR AMISTOSO</Text>}
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
              data={friendly.athletes?.filter((a) => a.side === athletesSide) ?? []}
              keyExtractor={(item) => item.id}
              renderItem={({ item: athlete }) => (
                <View style={s.athleteModalItem}>
                  <LinearGradient colors={[colors.primary, colors.primaryGlow]} style={s.athleteModalAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={s.athleteModalInitial}>
                      {(athlete.teamMember?.user?.name ?? athlete.teamMember?.guestName ?? '?').charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
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
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, marginBottom: spacing.md,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  emptyText: { fontSize: 14, color: colors.textMuted, fontFamily: fonts.text.regular },
  content: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  // Status
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 16, marginBottom: spacing.lg },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontFamily: fonts.text.semiBold, letterSpacing: 1.5 },
  liveDotWrap: { width: 8, height: 8, justifyContent: 'center', alignItems: 'center' },
  liveDotGlow: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: LIVE_COLOR },
  title: { fontSize: 20, fontFamily: fonts.text.bold, color: colors.text, marginBottom: spacing.lg },

  // Teams VS
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: spacing.xxl },
  teamCol: { alignItems: 'center', flex: 1 },
  teamCircleWrap: { position: 'relative', marginBottom: spacing.md },
  teamCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  teamInitial: { fontSize: 28, fontFamily: fonts.title.display, color: colors.text },
  teamName: { fontSize: 13, fontFamily: fonts.text.semiBold, color: colors.text, textAlign: 'center' },
  vs: { fontSize: 18, fontFamily: fonts.title.display, color: colors.primaryGlow, marginHorizontal: spacing.md, letterSpacing: 2 },
  athletesBtn: {
    position: 'absolute', bottom: -4, right: -4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.background,
  },

  // Athletes overlay
  athletesOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  athletesModal: { backgroundColor: colors.surface, borderRadius: 20, width: '85%', maxHeight: '60%', padding: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  athletesModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  athletesModalTitle: { fontSize: 16, fontFamily: fonts.text.bold, color: colors.text, flex: 1 },
  athleteModalItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  athleteModalAvatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  athleteModalInitial: { fontSize: 16, fontFamily: fonts.title.display, color: colors.text },
  athleteModalInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  athleteModalName: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.text },
  athletesModalEmpty: { fontSize: 13, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },

  // Watch live
  watchLiveBtn: { borderRadius: 16, overflow: 'hidden' },
  watchLiveGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.lg, position: 'relative',
  },
  watchLiveText: { fontSize: 14, letterSpacing: 2, color: '#FFF', fontFamily: fonts.text.semiBold },
  watchLivePulse: {
    position: 'absolute', right: spacing.lg, top: '50%', marginTop: -5,
    width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF',
  },

  // Winner
  winnerBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 12, paddingVertical: spacing.md, marginBottom: spacing.lg },
  winnerText: { fontSize: 14, fontFamily: fonts.text.bold, color: '#FFD700' },

  // Sets
  setsCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', padding: spacing.lg, marginBottom: spacing.xxl },
  setsTitle: { fontSize: 16, fontFamily: fonts.title.display, color: colors.text, marginBottom: spacing.md, textAlign: 'center', letterSpacing: 2 },
  setsSummaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md, gap: spacing.lg },
  setsSummaryCol: { alignItems: 'center', flex: 1 },
  setsSummaryName: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.text, textAlign: 'center' },
  setsSummaryCount: { fontSize: 32, fontFamily: fonts.title.display, color: colors.textMuted },
  setsWinner: { color: colors.primaryGlow },
  setsDivider: { fontSize: 24, fontFamily: fonts.title.display, color: colors.textMuted },
  setRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: 4 },
  setScore: { fontSize: 18, fontFamily: fonts.title.display, color: colors.textMuted, minWidth: 30, textAlign: 'center' },
  setScoreWin: { color: colors.primaryGlow },
  setLabel: { fontSize: 12, fontFamily: fonts.text.medium, color: colors.textSecondary },

  // Info card
  infoCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', padding: spacing.lg, gap: spacing.md, marginBottom: spacing.xxl },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoText: { fontSize: 14, fontFamily: fonts.text.regular, color: colors.text, flex: 1 },

  // Accepted section
  acceptedSection: { gap: spacing.md, marginBottom: spacing.xxl },
  refereeBtn: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  refereeBtnText: { fontSize: 13, fontFamily: fonts.text.bold, color: colors.primaryGlow, letterSpacing: 1 },
  codeDisplayCard: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(157,115,230,0.3)', padding: spacing.lg, alignItems: 'center' },
  codeDisplayIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(109,46,192,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  codeDisplayLabel: { fontSize: 10, fontFamily: fonts.text.medium, color: colors.textMuted, marginBottom: 4, letterSpacing: 1.5 },
  codeDisplayValue: { fontSize: 32, fontFamily: fonts.title.display, color: colors.primaryGlow, letterSpacing: 6 },
  codeDisplayHint: { fontSize: 11, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 16 },
  enterCodeBtn: { borderRadius: 14, overflow: 'hidden' },
  enterCodeGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  enterCodeText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },

  // Accept form
  acceptFormCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', padding: spacing.lg, marginBottom: spacing.xxl },
  acceptFormTitle: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.text, marginBottom: spacing.md, letterSpacing: 1 },
  athleteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: 'transparent' },
  athleteCardActive: { backgroundColor: 'rgba(109,46,192,0.12)', borderColor: colors.primary },
  checkCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  checkCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  athleteInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  athleteName: { fontSize: 13, fontFamily: fonts.text.semiBold, color: colors.text },
  athleteNameActive: { color: colors.primaryGlow },
  capBadge: { fontSize: 8, fontFamily: fonts.text.bold, color: '#FFD700', backgroundColor: 'rgba(255,215,0,0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, letterSpacing: 1 },
  guestBadge: { fontSize: 8, fontFamily: fonts.text.bold, color: colors.textMuted, backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, letterSpacing: 1 },
  acceptFormActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  confirmBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmText: { fontFamily: fonts.text.bold, fontSize: 13, color: colors.text, letterSpacing: 1.5, textAlign: 'center', paddingVertical: spacing.md, backgroundColor: colors.primary },

  // Actions
  actions: { gap: spacing.sm },
  actionsRow: { flexDirection: 'row', gap: spacing.sm },
  actionBtn: { flex: 1, borderRadius: 16, paddingVertical: spacing.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.sm },
  acceptBtn: { backgroundColor: 'rgba(76,175,80,0.12)' },
  acceptText: { fontSize: 14, fontFamily: fonts.text.bold, color: '#4CAF50', letterSpacing: 1 },
  rejectBtn: { backgroundColor: 'rgba(255,77,77,0.12)' },
  rejectText: { fontSize: 14, fontFamily: fonts.text.bold, color: colors.error, letterSpacing: 1 },
  cancelActionBtn: { backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  cancelActionText: { fontSize: 13, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1 },
});
