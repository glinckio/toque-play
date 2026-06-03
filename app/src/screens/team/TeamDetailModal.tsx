import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import TeamAvatar from '../../components/TeamAvatar';
import { teamService } from '../../services/team';
import { useAuthStore } from '../../stores/authStore';
import type { TeamStackParamList } from '../../navigation/types';
import type { Team, TeamMember } from '../../types/team';

type Nav = NativeStackNavigationProp<TeamStackParamList, 'TeamDetail'>;

function memberName(m: TeamMember) {
  return m.user?.name ?? m.guestName ?? '?';
}
type Route = RouteProp<TeamStackParamList, 'TeamDetail'>;

export default function TeamDetailModal() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { teamId } = route.params;
  const user = useAuthStore((s) => s.user);

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const isOwner = team?.ownerId === user?.id;

  const handleRemoveMember = (member: TeamMember) => {
    if (member.isCaptain) {
      Alert.alert('Atenção', 'Não é possível remover o capitão.');
      return;
    }
    Alert.alert('Remover Membro', `Remover ${memberName(member)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await teamService.removeMember(teamId, member.id);
            setMembers((prev) => prev.filter((m) => m.id !== member.id));
          } catch {
            Alert.alert('Erro', 'Não foi possível remover.');
          }
        },
      },
    ]);
  };

  const handleDeleteTeam = () => {
    Alert.alert('Excluir Equipe', 'Tem certeza? Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await teamService.remove(teamId);
            navigation.goBack();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const handleToggleCaptain = (member: TeamMember) => {
    Alert.alert(
      member.isCaptain ? 'Remover Capitão' : 'Tornar Capitão',
      member.isCaptain
        ? `${memberName(member)} não será mais capitão.`
        : `${memberName(member)} será o novo capitão.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await teamService.updateMember(teamId, member.id, {
                isCaptain: !member.isCaptain,
              });
              setMembers((prev) =>
                prev.map((m) =>
                  m.id === member.id ? { ...m, isCaptain: !m.isCaptain } : m
                )
              );
            } catch {
              Alert.alert('Erro', 'Não foi possível atualizar.');
            }
          },
        },
      ]
    );
  };

  const handleAvatarUpload = async () => {
    if (!isOwner || uploadingAvatar) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploadingAvatar(true);
    try {
      const updated = await teamService.uploadAvatar(teamId, result.assets[0].uri);
      setTeam(updated);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar o brasão.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (!team) {
    return (
      <SafeAreaView style={styles.loadingRoot} edges={['top']}>
        <Text style={styles.errorText}>Equipe não encontrada</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Team Hero */}
        <View style={styles.hero}>
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={isOwner ? handleAvatarUpload : undefined}
            activeOpacity={isOwner ? 0.7 : 1}
          >
            {uploadingAvatar ? (
              <View style={styles.avatarGradient}>
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            ) : (
              <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={80} />
            )}
            {isOwner && !uploadingAvatar && (
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={12} color={colors.text} />
              </View>
            )}
            {isOwner && (
              <View style={styles.ownerCrown}>
                <Ionicons name="star" size={10} color="#FFD700" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.teamName}>{team.name}</Text>
          {team.description ? (
            <Text style={styles.teamDesc}>{team.description}</Text>
          ) : null}

          <View style={styles.heroMeta}>
            <View style={styles.metaChip}>
              <Ionicons name="people" size={14} color={colors.primaryGlow} />
              <Text style={styles.metaChipText}>
                {members.length} membro{members.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Members Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ELENCO</Text>
            {isOwner && (
              <TouchableOpacity
                style={styles.addMemberBtn}
                onPress={() => navigation.navigate('AddMember', { teamId })}
                activeOpacity={0.7}
              >
                <Ionicons name="person-add-outline" size={16} color={colors.primaryGlow} />
                <Text style={styles.addMemberText}>ADICIONAR</Text>
              </TouchableOpacity>
            )}
          </View>

          {members.length > 0 ? (
            <View style={styles.memberList}>
              {members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  {/* Avatar */}
                  <View style={styles.memberAvatarWrap}>
                    <LinearGradient
                      colors={
                        member.isCaptain
                          ? ['#FFD700', '#FFA000']
                          : [colors.surfaceSoft, colors.surfaceSoft]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.memberAvatarGradient}
                    >
                      <Text style={[
                        styles.memberAvatarLetter,
                        !member.isCaptain && styles.memberAvatarLetterMuted,
                      ]}>
                        {(memberName(member)).charAt(0).toUpperCase()}
                      </Text>
                    </LinearGradient>
                  </View>

                  {/* Info */}
                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName} numberOfLines={1}>{memberName(member)}</Text>
                      {member.isCaptain && (
                        <View style={styles.captainBadge}>
                          <Ionicons name="ribbon" size={10} color={colors.primaryGlow} />
                          <Text style={styles.captainBadgeText}>CAP</Text>
                        </View>
                      )}
                      {member.isGuest && (
                        <View style={styles.guestBadge}>
                          <Text style={styles.guestBadgeText}>CONV</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions */}
                  {isOwner && (
                    <View style={styles.memberActions}>
                      <TouchableOpacity
                        onPress={() => handleToggleCaptain(member)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name={member.isCaptain ? 'ribbon' : 'ribbon-outline'}
                          size={18}
                          color={member.isCaptain ? colors.primaryGlow : colors.textMuted}
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
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyMembers}>
              <Ionicons name="people-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyMembersText}>Nenhum membro ainda</Text>
            </View>
          )}
        </View>

        {/* Danger Zone */}
        {isOwner && (
          <View style={styles.dangerSection}>
            <TouchableOpacity
              onPress={handleDeleteTeam}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={styles.deleteBtnText}>EXCLUIR EQUIPE</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingRoot: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: colors.textMuted, fontSize: 16, fontFamily: fonts.text.regular },
  backLink: { color: colors.primaryGlow, fontSize: 14, fontFamily: fonts.text.semiBold, marginTop: spacing.md },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerCrown: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontFamily: fonts.title.display,
    fontSize: 34,
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
  },
  teamDesc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
    lineHeight: 20,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  heroMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(109,46,192,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: 10,
  },
  metaChipText: {
    fontSize: 12,
    color: colors.primaryGlow,
    fontFamily: fonts.text.medium,
  },

  // Section
  section: { marginBottom: spacing.xxl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.title.display,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 2,
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addMemberText: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.primaryGlow,
    fontFamily: fonts.text.semiBold,
  },

  // Members
  memberList: { gap: spacing.md },
  memberCard: {
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
  memberAvatarWrap: {},
  memberAvatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarLetter: {
    fontFamily: fonts.title.display,
    fontSize: 18,
    color: colors.text,
  },
  memberAvatarLetterMuted: {
    color: colors.textMuted,
  },
  memberInfo: { flex: 1 },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(109,46,192,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  captainBadgeText: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.primaryGlow,
    fontFamily: fonts.text.bold,
  },
  guestBadge: {
    backgroundColor: 'rgba(255,152,0,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  guestBadgeText: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#FF9800',
    fontFamily: fonts.text.bold,
  },
  memberActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  emptyMembers: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.hero,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyMembersText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },

  // Danger
  dangerSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    paddingTop: spacing.xl,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,77,77,0.2)',
  },
  deleteBtnText: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.error,
    fontFamily: fonts.text.semiBold,
  },
});
