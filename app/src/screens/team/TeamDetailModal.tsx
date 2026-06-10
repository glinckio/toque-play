import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { teamService } from '../../services/team';
import { useAuthStore } from '../../stores/authStore';
import { useDialogStore } from '../../stores/dialogStore';
import type { TeamStackParamList } from '../../navigation/types';
import type { Team, TeamMember } from '../../types/team';
import { POSITION_LABELS } from '../../types/team';
import HeroHeader from '../../components/HeroHeader';

type Nav = NativeStackNavigationProp<TeamStackParamList, 'TeamDetail'>;
type Route = RouteProp<TeamStackParamList, 'TeamDetail'>;

function memberName(m: TeamMember) {
  return m.user?.name ?? m.guestName ?? '?';
}

export default function TeamDetailModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId } = route.params;
  const user = useAuthStore((s) => s.user);
  const dialog = useDialogStore();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [infoMember, setInfoMember] = useState<TeamMember | null>(null);

  const load = useCallback(async () => {
    try {
      const [t, m] = await Promise.all([
        teamService.findOne(teamId),
        teamService.findMembers(teamId),
      ]);
      setTeam(t);
      setMembers(m);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [teamId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = () => { setRefreshing(true); load(); };
  const isOwner = team?.ownerId === user?.id;

  const handleRemoveMember = (member: TeamMember) => {
    if (member.isCaptain) {
      dialog.warning('Não é possível remover o capitão.');
      return;
    }
    dialog.confirm({
      title: 'Remover Membro',
      message: `Remover ${memberName(member)}?`,
      confirmText: 'Remover',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await teamService.removeMember(teamId, member.id);
          setMembers((prev) => prev.filter((m) => m.id !== member.id));
        } catch { dialog.error('Não foi possível remover.'); }
      },
    });
  };

  const handleDeleteTeam = () => {
    dialog.confirm({
      title: 'Excluir Equipe',
      message: 'Tem certeza? Essa ação não pode ser desfeita.',
      confirmText: 'Excluir',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try { await teamService.remove(teamId); navigation.goBack(); }
        catch { dialog.error('Não foi possível excluir.'); }
      },
    });
  };

  const handleToggleCaptain = (member: TeamMember) => {
    dialog.confirm({
      title: member.isCaptain ? 'Remover Capitão' : 'Tornar Capitão',
      message: member.isCaptain ? `${memberName(member)} não será mais capitão.` : `${memberName(member)} será o novo capitão.`,
      confirmText: 'Confirmar',
      onConfirm: async () => {
        try {
          await teamService.updateMember(teamId, member.id, { isCaptain: !member.isCaptain });
          setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, isCaptain: !m.isCaptain } : m));
        } catch { dialog.error('Não foi possível atualizar.'); }
      },
    });
  };

  const handleEditMember = (member: TeamMember) => {
    navigation.navigate('AddMember', {
      teamId,
      memberId: member.id,
      isGuest: member.isGuest,
      guestName: member.guestName ?? undefined,
      memberName: member.user?.name,
      positions: member.positions,
    });
  };

  const handleAvatarUpload = async () => {
    if (!isOwner || uploadingAvatar) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploadingAvatar(true);
    try {
      const updated = await teamService.uploadAvatar(teamId, result.assets[0].uri);
      setTeam(updated);
    } catch { dialog.error('Não foi possível enviar o brasão.'); }
    finally { setUploadingAvatar(false); }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <HeroHeader title="EQUIPE" watermark="TEAM" onBack={() => navigation.goBack()} rounded />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!team) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <HeroHeader title="EQUIPE" watermark="TEAM" onBack={() => navigation.goBack()} rounded />
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>Equipe não encontrada</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader
        title={team.name.toUpperCase()}
        watermark={team.name.toUpperCase().slice(0, 8)}
        onBack={() => navigation.goBack()}
        subtitle={team.description ?? undefined}
        rounded
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Avatar + upload */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={isOwner ? handleAvatarUpload : undefined}
            activeOpacity={isOwner ? 0.7 : 1}
          >
            {uploadingAvatar ? (
              <View style={styles.avatarCircle}>
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            ) : team.avatarUrl ? (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>{team.name[0]}</Text>
              </View>
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>{team.name[0]}</Text>
              </View>
            )}
            {isOwner && !uploadingAvatar && (
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={12} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{members.length}</Text>
            <Text style={styles.statLabel}>Membros</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Vitórias</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0%</Text>
            <Text style={styles.statLabel}>Aproveitamento</Text>
          </View>
        </View>

        {/* Athletes section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ATLETAS</Text>
            {isOwner && (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate('AddMember', { teamId })}
                activeOpacity={0.7}
              >
                <Ionicons name="person-add-outline" size={16} color={colors.primary} />
                <Text style={styles.addBtnText}>Adicionar</Text>
              </TouchableOpacity>
            )}
          </View>

          {members.length > 0 ? (
            <View style={styles.memberList}>
              {members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={[styles.memberAvatar, member.isCaptain && styles.memberAvatarCaptain]}>
                    <Text style={[styles.memberAvatarLetter, member.isCaptain && styles.memberAvatarLetterCaptain]}>
                      {memberName(member).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName} numberOfLines={1}>{memberName(member)}</Text>
                      {member.isCaptain && (
                        <View style={styles.captainBadge}>
                          <Ionicons name="ribbon" size={10} color={colors.primary} />
                          <Text style={styles.captainBadgeText}>CAP</Text>
                        </View>
                      )}
                      {member.isGuest && (
                        <View style={styles.guestBadge}>
                          <Text style={styles.guestBadgeText}>CONV</Text>
                        </View>
                      )}
                    </View>
                    {member.positions?.length > 0 && (
                      <View style={styles.positionsRow}>
                        {member.positions.map((p) => (
                          <View key={p} style={styles.positionBadge}>
                            <Text style={styles.positionBadgeText}>{POSITION_LABELS[p]}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={styles.memberActions}>
                    <TouchableOpacity
                      onPress={() => setInfoMember(member)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="information-circle-outline" size={18} color={colors.textPlaceholder} />
                    </TouchableOpacity>
                    {isOwner && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleEditMember(member)}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="create-outline" size={18} color={colors.textPlaceholder} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleToggleCaptain(member)}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons
                            name={member.isCaptain ? 'ribbon' : 'ribbon-outline'}
                            size={18}
                            color={member.isCaptain ? colors.primary : colors.textPlaceholder}
                          />
                        </TouchableOpacity>
                        {!member.isCaptain && (
                          <TouchableOpacity
                            onPress={() => handleRemoveMember(member)}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Ionicons name="close-circle-outline" size={18} color={colors.error} />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyMembers}>
              <Ionicons name="people-outline" size={32} color={colors.textPlaceholder} />
              <Text style={styles.emptyMembersText}>Nenhum membro ainda</Text>
            </View>
          )}
        </View>

        {/* Delete */}
        {isOwner && (
          <TouchableOpacity onPress={handleDeleteTeam} style={styles.deleteBtn} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.deleteBtnText}>Excluir equipe</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Athlete info popup */}
      <Modal
        visible={!!infoMember}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoMember(null)}
      >
        <TouchableOpacity
          style={styles.infoOverlay}
          activeOpacity={1}
          onPress={() => setInfoMember(null)}
        >
          <View style={styles.infoCard}>
            {infoMember && (
              <>
                <View style={styles.infoHeader}>
                  <View style={styles.infoAvatar}>
                    <Text style={styles.infoAvatarLetter}>
                      {memberName(infoMember).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.infoHeaderInfo}>
                    <Text style={styles.infoName}>{memberName(infoMember)}</Text>
                    <View style={styles.infoBadges}>
                      {infoMember.isCaptain && (
                        <View style={styles.captainBadge}>
                          <Ionicons name="ribbon" size={10} color={colors.primary} />
                          <Text style={styles.captainBadgeText}>CAP</Text>
                        </View>
                      )}
                      {infoMember.isGuest && (
                        <View style={styles.guestBadge}>
                          <Text style={styles.guestBadgeText}>CONVIDADO</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setInfoMember(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={22} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                {infoMember.positions?.length > 0 ? (
                  <View style={styles.infoPositions}>
                    {infoMember.positions.map((p) => (
                      <View key={p} style={styles.positionBadge}>
                        <Text style={styles.positionBadgeText}>{POSITION_LABELS[p]}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                {!infoMember.isGuest && infoMember.user ? (
                  <View style={styles.infoContact}>
                    <View style={styles.infoContactRow}>
                      <Ionicons name="mail-outline" size={16} color={colors.textMuted} />
                      <Text style={styles.infoContactText}>{infoMember.user.email}</Text>
                    </View>
                    <View style={styles.infoContactRow}>
                      <Ionicons name="call-outline" size={16} color={colors.textMuted} />
                      <Text style={styles.infoContactText}>
                        {infoMember.user.phone ? infoMember.user.phone : 'Telefone não informado'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.infoGuestNote}>Convidado sem contato vinculado.</Text>
                )}
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingRoot: { flex: 1, backgroundColor: colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.textMuted, fontSize: 16, fontFamily: fonts.text.regular },
  backLink: { color: colors.primary, fontSize: 14, fontFamily: fonts.text.semiBold, marginTop: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  avatarSection: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg },
  avatarWrap: { position: 'relative' },
  avatarCircle: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: fonts.title.regular, fontSize: 32,
    color: colors.primary, lineHeight: 1,
  },
  avatarEditBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: fonts.title.regular, fontSize: typography.sizes.title,
    color: colors.text, lineHeight: 1,
  },
  statLabel: {
    fontFamily: fonts.text.medium, fontSize: typography.sizes.md,
    color: colors.textMuted, marginTop: 4,
  },
  statDivider: { width: 1, backgroundColor: '#F4EFFA' },

  section: { marginBottom: spacing.xxl },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.title.regular, fontSize: typography.sizes.heading,
    color: colors.text, letterSpacing: typography.letterSpacing.medium,
  },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addBtnText: {
    fontFamily: fonts.text.semiBold, fontSize: typography.sizes.md, color: colors.primary,
  },

  memberList: { gap: spacing.md },
  memberCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: radius.card,
    padding: spacing.lg, gap: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  memberAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  memberAvatarCaptain: { backgroundColor: '#FFF3CD' },
  memberAvatarLetter: {
    fontFamily: fonts.title.regular, fontSize: 18, color: colors.primary, lineHeight: 1,
  },
  memberAvatarLetterCaptain: { color: '#B8860B' },
  memberInfo: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  memberName: {
    fontFamily: fonts.text.semiBold, fontSize: typography.sizes.input, color: colors.text,
  },
  positionsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4,
  },
  positionBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  positionBadgeText: {
    fontFamily: fonts.text.bold, fontSize: 11,
    color: colors.primary, letterSpacing: 0.5,
  },
  captainBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  captainBadgeText: {
    fontFamily: fonts.text.bold, fontSize: 11, color: colors.primary,
    letterSpacing: 1.5,
  },
  guestBadge: {
    backgroundColor: 'rgba(240,160,48,0.15)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  guestBadgeText: {
    fontFamily: fonts.text.bold, fontSize: 11, color: colors.warning, letterSpacing: 1.5,
  },
  memberActions: { flexDirection: 'row', gap: spacing.sm },

  emptyMembers: {
    backgroundColor: '#FFFFFF', borderRadius: radius.card,
    padding: spacing.xxl, alignItems: 'center', gap: spacing.sm,
  },
  emptyMembersText: {
    fontFamily: fonts.text.regular, fontSize: typography.sizes.body, color: colors.textMuted,
  },

  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(224,69,69,0.08)',
  },
  deleteBtnText: {
    fontFamily: fonts.text.semiBold, fontSize: typography.sizes.input, color: colors.error,
  },

  // ─── Athlete info popup ──────────────────────
  infoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,30,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  infoAvatar: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  infoAvatarLetter: {
    fontFamily: fonts.title.regular, fontSize: 22,
    color: colors.primary, lineHeight: 1,
  },
  infoHeaderInfo: { flex: 1 },
  infoName: {
    fontFamily: fonts.text.semiBold, fontSize: typography.sizes.button, color: colors.text,
  },
  infoBadges: { flexDirection: 'row', gap: 4, marginTop: 4 },
  infoPositions: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: spacing.md,
  },
  infoContact: { marginTop: spacing.lg, gap: spacing.sm },
  infoContactRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  infoContactText: {
    flex: 1,
    fontFamily: fonts.text.regular, fontSize: typography.sizes.md, color: colors.text,
  },
  infoGuestNote: {
    marginTop: spacing.md,
    fontFamily: fonts.text.regular, fontSize: typography.sizes.sm,
    color: colors.textMuted, fontStyle: 'italic',
  },
});
