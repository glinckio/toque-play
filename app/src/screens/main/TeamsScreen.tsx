import React, { useState, useCallback } from 'react';
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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { teamService } from '../../services/team';
import { useAuthStore } from '../../stores/authStore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import type { Team } from '../../types/team';
import { memberCount } from '../../utils/team';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

export default function TeamsScreen() {
  const user = useAuthStore((s) => s.user);
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const onRefresh = () => { setRefreshing(true); fetchTeams(); };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    setCreating(true);
    try {
      const newTeam = await teamService.create({
        name: createName.trim(),
        description: createDesc.trim() || undefined,
      });
      if (createAvatarUri) {
        try {
          const updated = await teamService.uploadAvatar(newTeam.id, createAvatarUri);
          setTeams((prev) => [updated, ...prev]);
        } catch {
          setTeams((prev) => [newTeam, ...prev]);
          Alert.alert('Atenção', 'Time criado, mas erro ao enviar brasão.');
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
        <HeroHeader title="EQUIPES" subtitle={`${teams.length} equipes`} watermark="TEAMS" rounded />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HeroHeader title="EQUIPES" subtitle={`${teams.length} equipes · ${totalMembers} atletas`} watermark="TEAMS" rounded />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Create CTA */}
        <TouchableOpacity style={styles.createCta} onPress={() => setShowCreate(true)} activeOpacity={0.8}>
          <View style={styles.createCtaIcon}>
            <Ionicons name="add" size={20} color={colors.primary} />
          </View>
          <Text style={styles.createCtaText}>Nova equipe</Text>
        </TouchableOpacity>

        {/* Create Form */}
        {showCreate && (
          <View style={styles.createCard}>
            <Text style={styles.createCardTitle}>NOVA EQUIPE</Text>
            <TouchableOpacity style={styles.avatarPicker} onPress={pickAvatar} activeOpacity={0.7}>
              {createAvatarUri ? (
                <Image source={{ uri: createAvatarUri }} style={styles.avatarPickerImage} />
              ) : (
                <View style={styles.avatarPickerPlaceholder}>
                  <Ionicons name="camera-outline" size={24} color={colors.textPlaceholder} />
                  <Text style={styles.avatarPickerText}>Brasão</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.inputWrap}>
              <Ionicons name="shield-outline" size={16} color={colors.textPlaceholder} />
              <TextInput
                style={styles.input}
                placeholder="Nome da equipe"
                placeholderTextColor={colors.textPlaceholder}
                value={createName}
                onChangeText={setCreateName}
                maxLength={40}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.inputWrap}>
              <Ionicons name="document-text-outline" size={16} color={colors.textPlaceholder} />
              <TextInput
                style={styles.input}
                placeholder="Descrição (opcional)"
                placeholderTextColor={colors.textPlaceholder}
                value={createDesc}
                onChangeText={setCreateDesc}
                maxLength={120}
                multiline
              />
            </View>
            <View style={styles.createActions}>
              <TouchableOpacity
                style={styles.createCancel}
                onPress={() => { setShowCreate(false); setCreateName(''); setCreateDesc(''); setCreateAvatarUri(null); }}
                activeOpacity={0.7}
              >
                <Text style={styles.createCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <ChevronButton
                variant="primary"
                size="md"
                onPress={handleCreate}
                disabled={!createName.trim() || creating}
              >
                {creating ? 'CRIANDO...' : 'CRIAR'}
              </ChevronButton>
            </View>
          </View>
        )}

        {/* Team List */}
        {teams.length > 0 ? (
          <View style={styles.teamList}>
            {teams.map((team) => {
              const mc = memberCount(team);
              const isOwner = team.ownerId === user?.id;
              return (
                <TouchableOpacity
                  key={team.id}
                  style={styles.teamCard}
                  activeOpacity={0.95}
                  onPress={() => rootNav.navigate('Team', { screen: 'TeamDetail', params: { teamId: team.id } })}
                >
                  <View style={styles.teamAvatar}>
                    <Ionicons name="volleyball-outline" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName} numberOfLines={1}>{team.name}</Text>
                    <Text style={styles.teamMeta}>
                      {team.sport === 'BEACH' ? 'Praia' : 'Quadra'} · {mc} atleta{mc !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  {isOwner && (
                    <View style={styles.ownerDot}>
                      <Ionicons name="star" size={8} color="#FFD700" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <View style={styles.emptyIcon}>
              <Ionicons name="shield-outline" size={40} color={colors.textPlaceholder} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma equipe</Text>
            <Text style={styles.emptyText}>Crie sua primeira equipe e comece a competir</Text>
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

  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  createCtaIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCtaText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.text,
  },

  createCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  createCardTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
  },
  avatarPicker: { marginBottom: spacing.lg },
  avatarPickerImage: { width: 80, height: 80, borderRadius: 24 },
  avatarPickerPlaceholder: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.inputBackground,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  avatarPickerText: {
    fontFamily: fonts.text.regular, fontSize: 9,
    color: colors.textPlaceholder, letterSpacing: 1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    marginBottom: spacing.md,
    width: '100%',
  },
  input: {
    flex: 1, color: colors.text, fontSize: typography.sizes.input,
    fontFamily: fonts.text.regular, paddingVertical: 0,
  },
  createActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    width: '100%',
    marginTop: spacing.sm,
  },
  createCancel: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  createCancelText: {
    fontFamily: fonts.text.semiBold, fontSize: typography.sizes.md, color: colors.textMuted,
  },

  teamList: { gap: spacing.md },

  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  teamAvatar: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  teamInfo: { flex: 1, minWidth: 0 },
  teamName: {
    fontFamily: fonts.text.bold, fontSize: 15, color: colors.text,
  },
  teamMeta: {
    fontFamily: fonts.text.regular, fontSize: typography.sizes.md,
    color: colors.textMuted, marginTop: 2,
  },
  ownerDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#FFD70033',
    alignItems: 'center', justifyContent: 'center',
  },

  emptySection: { alignItems: 'center', paddingTop: 60, gap: spacing.md },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.title.regular, fontSize: typography.sizes.heading,
    color: colors.text, letterSpacing: typography.letterSpacing.medium,
  },
  emptyText: {
    fontFamily: fonts.text.regular, fontSize: typography.sizes.body,
    color: colors.textMuted, textAlign: 'center',
  },
});
