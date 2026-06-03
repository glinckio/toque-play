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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { tournamentService } from '../../services/tournament';
import { teamService } from '../../services/team';
import type { TournamentStackParamList } from '../../navigation/types';
import type { Team, TeamMember } from '../../types/team';
import { memberCount } from '../../utils/team';
import TeamAvatar from '../../components/TeamAvatar';
import type { Tournament } from '../../types/tournament';

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'RegistrationTeamSelect'>;
type Route = RouteProp<TournamentStackParamList, 'RegistrationTeamSelect'>;

export default function RegistrationTeamSelect() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tournamentId } = route.params;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([
        tournamentService.findOne(tournamentId),
        teamService.findAll(),
      ]).then(async ([t, tm]) => {
        setTournament(t);
        setTeams(tm);
        if (t.categories?.length === 1) setSelectedCategory(t.categories[0].id);

        // Fetch members for each team
        const membersMap: Record<string, TeamMember[]> = {};
        await Promise.all(
          tm.map(async (team) => {
            try {
              const members = await teamService.findMembers(team.id);
              membersMap[team.id] = members;
            } catch {}
          })
        );
        setTeamMembers(membersMap);
      }).catch(() => {}).finally(() => setLoading(false));
    }, [tournamentId]),
  );

  const getCategory = useCallback(() => {
    return tournament?.categories?.find((c) => c.id === selectedCategory);
  }, [tournament, selectedCategory]);

  const isTeamCompatible = useCallback(
    (team: Team) => {
      const cat = getCategory();
      if (!cat) return { ok: false, reason: 'Selecione uma categoria' };
      const members = teamMembers[team.id];
      const count = members?.length ?? memberCount(team);
      if (count < cat.minMembers) return { ok: false, reason: `Mínimo ${cat.minMembers} jogadores (tem ${count})` };
      if (count > cat.maxMembers) return { ok: false, reason: `Máximo ${cat.maxMembers} jogadores (tem ${count})` };
      return { ok: true };
    },
    [getCategory, teamMembers],
  );

  const handleSelect = (team: Team) => {
    if (!selectedCategory) {
      Alert.alert('Atenção', 'Selecione uma categoria');
      return;
    }
    const cat = getCategory();
    if (!cat) return;
    navigation.navigate('RegistrationMemberSelect', {
      tournamentId,
      teamId: team.id,
      categoryId: selectedCategory,
      minMembers: cat.minMembers,
      maxMembers: cat.maxMembers,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  const categories = tournament?.categories ?? [];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INSCREVER TIME</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.tournamentName}>{tournament?.name}</Text>

        {/* Category selector */}
        {categories.length > 1 && (
          <View style={styles.catRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.catChipText, selectedCategory === cat.id && styles.catChipTextActive]}>
                  {cat.type === 'MALE' ? 'Masculino' : cat.type === 'FEMALE' ? 'Feminino' : 'Misto'} · {cat.format === 'PAIR' ? 'Dupla' : cat.format === 'QUARTET' ? 'Quarteto' : 'Sexteto'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Team list */}
        <Text style={styles.sectionTitle}>SELECIONE SEU TIME</Text>

        {teams.length === 0 ? (
          <View style={styles.emptySection}>
            <Ionicons name="shield-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Você precisa criar uma equipe primeiro</Text>
          </View>
        ) : (
          <View style={styles.teamList}>
            {teams.map((team) => {
              const compat = isTeamCompatible(team);
              const members = teamMembers[team.id];
              const mc = members?.length ?? memberCount(team);
              return (
                <TouchableOpacity
                  key={team.id}
                  style={[styles.teamCard, !compat.ok && styles.teamCardDisabled]}
                  onPress={() => compat.ok && handleSelect(team)}
                  disabled={!compat.ok}
                  activeOpacity={0.7}
                >
                  <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={44} />
                  <View style={styles.teamInfo}>
                    <Text style={styles.teamName}>{team.name}</Text>
                    <Text style={styles.teamMeta}>
                      {mc} membro{mc !== 1 ? 's' : ''}
                      {!compat.ok && ` — ${compat.reason}`}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={compat.ok ? colors.textMuted : colors.disabled} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontFamily: fonts.title.display, fontSize: 22, color: colors.text, letterSpacing: 2 },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  tournamentName: { fontSize: 16, color: colors.textSecondary, fontFamily: fonts.text.semiBold, marginBottom: spacing.xl },

  catRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, flexWrap: 'wrap' },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  catChipActive: { backgroundColor: 'rgba(109,46,192,0.15)', borderColor: 'rgba(157,115,230,0.3)' },
  catChipText: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.medium },
  catChipTextActive: { color: colors.primaryGlow },

  sectionTitle: { fontFamily: fonts.title.display, fontSize: 18, color: colors.text, letterSpacing: 2, marginBottom: spacing.lg },
  emptySection: { alignItems: 'center', paddingTop: spacing.hero, gap: spacing.md },
  emptyText: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular },

  teamList: { gap: spacing.md },
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
  teamCardDisabled: { opacity: 0.5 },
  teamAvatar: { width: 40, height: 40, borderRadius: 12, overflow: 'hidden' },
  teamAvatarGradient: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  teamAvatarInitial: { fontFamily: fonts.title.display, fontSize: 18, color: colors.text },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 14, color: colors.text, fontFamily: fonts.text.semiBold },
  teamMeta: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular, marginTop: 2 },
});
