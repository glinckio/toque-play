import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '../../components/AppHeader';
import TeamAvatar from '../../components/TeamAvatar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { teamService } from '../../services/team';
import { useAuthStore } from '../../stores/authStore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import type { Team } from '../../types/team';
import { memberCount } from '../../utils/team';

export default function TeamsScreen({ onAvatarPress }: { onAvatarPress?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createAvatarUri, setCreateAvatarUri] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      const data = await teamService.findAll();
      setTeams(data);
    } catch {
      setTeams([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTeams();
    }, [fetchTeams]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeams();
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const newTeam = await teamService.create({
        name: createName.trim(),
        description: createDesc.trim() || undefined,
      });
      // Upload avatar if selected
      if (createAvatarUri) {
        try {
          const updated = await teamService.uploadAvatar(newTeam.id, createAvatarUri);
          setTeams((prev) => [updated, ...prev]);
        } catch {
          setTeams((prev) => [newTeam, ...prev]);
          Alert.alert('Atenção', 'Time criado, mas houve erro ao enviar o brasão.');
        }
      } else {
        setTeams((prev) => [newTeam, ...prev]);
      }
      setShowCreate(false);
      setCreateName('');
      setCreateDesc('');
      setCreateAvatarUri(null);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a equipe');
    } finally {
      setCreating(false);
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setCreateAvatarUri(result.assets[0].uri);
    }
  };

  const totalMembers = teams.reduce((sum, t) => sum + memberCount(t), 0);

  if (loading) {
    return (
      <View style={styles.root}>
        <AppHeader title="EQUIPES" showAvatar onAvatarPress={onAvatarPress} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppHeader title="EQUIPES" showAvatar onAvatarPress={onAvatarPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── Stats Banner ───────────────────────────── */}
        <View style={styles.statsBanner}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{teams.length}</Text>
            <Text style={styles.statLabel}>EQUIPES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{totalMembers}</Text>
            <Text style={styles.statLabel}>ATLETAS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primaryGlow} />
            <Text style={styles.statLabel}>ATIVO</Text>
          </View>
        </View>

        {/* ─── Create CTA ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.createCta}
          onPress={() => setShowCreate(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryGlow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createCtaGradient}
          >
            <Ionicons name="add" size={22} color={colors.text} />
            <Text style={styles.createCtaText}>CRIAR NOVA EQUIPE</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* ─── Create Form ────────────────────────────── */}
        {showCreate && (
          <View style={styles.createCard}>
            <View style={styles.createCardGlow} />
            <Text style={styles.createCardTitle}>NOVA EQUIPE</Text>

            <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar} activeOpacity={0.7}>
              {createAvatarUri ? (
                <Image source={{ uri: createAvatarUri }} style={styles.avatarPickerImage} />
              ) : (
                <View style={styles.avatarPickerPlaceholder}>
                  <Ionicons name="camera-outline" size={24} color={colors.textMuted} />
                  <Text style={styles.avatarPickerText}>Brasão</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputWrap}>
              <Ionicons name="shield-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Nome da equipe"
                placeholderTextColor={colors.textMuted}
                value={createName}
                onChangeText={setCreateName}
                maxLength={40}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="document-text-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Descrição (opcional)"
                placeholderTextColor={colors.textMuted}
                value={createDesc}
                onChangeText={setCreateDesc}
                maxLength={120}
                multiline
              />
            </View>

            <View style={styles.createActions}>
              <TouchableOpacity
                style={styles.createCancel}
                onPress={() => {
                  setShowCreate(false);
                  setCreateName('');
                  setCreateDesc('');
                  setCreateAvatarUri(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.createCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createConfirm}
                onPress={handleCreate}
                disabled={!createName.trim() || creating}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.createConfirmGradient}
                >
                  {creating ? (
                    <ActivityIndicator color={colors.text} size="small" />
                  ) : (
                    <Text style={styles.createConfirmText}>CRIAR</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ─── Team List ──────────────────────────────── */}
        {teams.length > 0 ? (
          <View style={styles.teamList}>
            {teams.map((team, index) => {
              const mc = memberCount(team);
              const captain = team.members?.find((m) => m.isCaptain);
              const isOwner = team.ownerId === user?.id;

              return (
                <TouchableOpacity key={team.id} style={styles.teamCard} activeOpacity={0.7}
                    onPress={() => rootNav.navigate('Team', { screen: 'TeamDetail', params: { teamId: team.id } })}
                  >
                  {/* Rank indicator */}
                  <View style={styles.teamRank}>
                    <Text style={styles.teamRankText}>{String(index + 1).padStart(2, '0')}</Text>
                  </View>

                  {/* Avatar */}
                  <View style={styles.teamAvatarWrap}>
                    <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={48} />
                    {isOwner && (
                      <View style={styles.ownerBadge}>
                        <Ionicons name="star" size={8} color="#FFD700" />
                      </View>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                    <View style={styles.teamMeta}>
                      <Ionicons name="people" size={12} color={colors.primaryGlow} />
                      <Text style={styles.teamMetaText}>
                        {mc} membro{mc !== 1 ? 's' : ''}
                      </Text>
                      {captain && (
                        <>
                          <Text style={styles.metaSep}>·</Text>
                          <Ionicons name="ribbon" size={12} color={colors.primaryGlow} />
                          <Text style={styles.teamMetaText}>{captain.name}</Text>
                        </>
                      )}
                    </View>
                    {team.description ? (
                      <Text style={styles.teamDesc} numberOfLines={1}>{team.description}</Text>
                    ) : null}
                  </View>

                  {/* Action */}
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <View style={styles.emptyIconWrap}>
              <LinearGradient
                colors={['rgba(109,46,192,0.2)', 'rgba(109,46,192,0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyIconGradient}
              >
                <Ionicons name="shield-outline" size={56} color={colors.primaryGlow} />
              </LinearGradient>
            </View>
            <Text style={styles.emptyTitle}>NENHUMA EQUIPE AINDA</Text>
            <Text style={styles.emptyText}>
              Crie sua primeira equipe, convide{'\n'}atletas e comece a competir
            </Text>
            <TouchableOpacity
              style={styles.emptyCta}
              onPress={() => setShowCreate(true)}
              activeOpacity={0.8}
            >
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 140 },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // ─── Stats Banner ─────────────────────────────────
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: fonts.title.display,
    fontSize: 32,
    color: colors.text,
    letterSpacing: 2,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // ─── Create CTA ───────────────────────────────────
  createCta: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  createCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(157,115,230,0.3)',
  },
  createCtaText: {
    fontFamily: fonts.title.display,
    fontSize: 18,
    letterSpacing: 3,
    color: colors.text,
  },

  // ─── Create Form Card ─────────────────────────────
  createCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.2)',
    padding: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  createCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primaryGlow,
    shadowColor: colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  createCardTitle: {
    fontFamily: fonts.title.display,
    fontSize: 24,
    color: colors.text,
    letterSpacing: 3,
    marginBottom: spacing.lg,
  },
  avatarPicker: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  avatarPickerImage: {
    width: 80,
    height: 80,
    borderRadius: 24,
  },
  avatarPickerPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  avatarPickerText: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    letterSpacing: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.text.regular,
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  createCancel: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  createCancelText: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textMuted,
    fontFamily: fonts.text.semiBold,
  },
  createConfirm: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createConfirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  createConfirmText: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },

  // ─── Team List ────────────────────────────────────
  teamList: {
    gap: spacing.md,
  },

  // ─── Team Card ────────────────────────────────────
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    overflow: 'hidden',
  },
  teamRank: {
    width: 28,
    alignItems: 'center',
  },
  teamRankText: {
    fontFamily: fonts.title.display,
    fontSize: 16,
    color: 'rgba(255,255,255,0.15)',
    letterSpacing: 1,
  },

  // Avatar
  teamAvatarWrap: {
    position: 'relative',
  },
  ownerBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Info
  teamInfo: {
    flex: 1,
    gap: 2,
  },
  teamName: {
    fontSize: 15,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  teamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teamMetaText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  metaSep: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.1)',
  },
  teamDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    fontFamily: fonts.text.regular,
    marginTop: 2,
  },

  // ─── Empty State ──────────────────────────────────
  emptySection: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.hero * 2,
    alignItems: 'center',
    gap: spacing.md,
    overflow: 'hidden',
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.title.display,
    fontSize: 24,
    color: colors.text,
    letterSpacing: 3,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: fonts.text.regular,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyCta: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  emptyCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  emptyCtaText: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
});
