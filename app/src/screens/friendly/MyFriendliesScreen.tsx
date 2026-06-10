import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
  TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { friendlyService } from '../../services/friendly';
import { teamService } from '../../services/team';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import type { Team } from '../../types/team';
import TeamAvatar from '../../components/TeamAvatar';
import type { Friendly } from '../../types/friendly';
import { FriendlyStatus } from '../../types/friendly';
import type { RootStackParamList } from '../../navigation/types';
import HeroHeader from '../../components/HeroHeader';
import TabBar from '../../components/TabBar';
import StatusBadge from '../../components/StatusBadge';
import ChevronButton from '../../components/ChevronButton';

type FilterTab = 'ALL' | FriendlyStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'Todos' },
  { key: FriendlyStatus.PENDING, label: 'Pendentes' },
  { key: FriendlyStatus.ACCEPTED, label: 'Aceitos' },
  { key: FriendlyStatus.COMPLETED, label: 'Concluídos' },
];

export default function MyFriendliesScreen({ navigation }: any) {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [friendlies, setFriendlies] = useState<Friendly[]>([]);
  const [filter, setFilter] = useState<FilterTab>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Team search
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [searching, setSearching] = useState(false);

  const fetchFriendlies = useCallback(async () => {
    try {
      const data = await friendlyService.findMine();
      setFriendlies(data);
    } catch {
      setFriendlies([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFriendlies().finally(() => { setLoading(false); });
    }, [fetchFriendlies]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFriendlies().finally(() => setRefreshing(false));
  };

  const handleTeamSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const results = await teamService.search(q.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectTeamAndCreate = (team: Team) => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    rootNav.navigate('Friendly', { screen: 'CreateFriendly', params: { challengedTeamId: team.id, challengedTeamName: team.name } });
  };

  const filtered = filter === 'ALL' ? friendlies : friendlies.filter((f) => f.status === filter);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <HeroHeader
        title="MEUS AMISTOSOS"
        subtitle={`${friendlies.length} amistoso${friendlies.length !== 1 ? 's' : ''}`}
        watermark="FRIENDLY"
        onBack={() => navigation.goBack()}
        rounded
      />

      {/* Filter tabs */}
      <View style={s.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TabBar
            tabs={FILTER_TABS.map((t) => ({ key: t.key, label: t.label }))}
            activeTab={filter}
            onTabChange={(key) => setFilter(key as FilterTab)}
            variant="pill"
          />
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {/* Request friendly button */}
        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => { setShowSearch(true); setSearchQuery(''); setSearchResults([]); }}
          icon={<Ionicons name="flash" size={16} color="#FFFFFF" />}
        >
          SOLICITAR AMISTOSO
        </ChevronButton>

        {filtered.length > 0 ? (
          <View style={s.list}>
            {filtered.map((f) => {
              const nameA = f.requesterTeam?.name ?? 'Time A';
              const nameB = f.challengedTeam?.name ?? 'A definir';
              return (
                <TouchableOpacity
                  key={f.id}
                  style={s.card}
                  activeOpacity={0.7}
                  onPress={() => rootNav.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: f.id } })}
                >
                  <View style={s.cardTop}>
                    <StatusBadge status={f.status} size="sm" />
                  </View>

                  <View style={s.teamsRow}>
                    <View style={s.teamBlock}>
                      <TeamAvatar avatarUrl={f.requesterTeam?.avatarUrl} name={nameA} size={36} />
                      <Text style={s.teamName} numberOfLines={1}>{nameA}</Text>
                    </View>
                    <Text style={s.vs}>VS</Text>
                    <View style={s.teamBlock}>
                      <TeamAvatar avatarUrl={f.challengedTeam?.avatarUrl} name={nameB} size={36} />
                      <Text style={s.teamName} numberOfLines={1}>{nameB}</Text>
                    </View>
                  </View>

                  <View style={s.metaRow}>
                    {f.city && (
                      <View style={s.metaItem}>
                        <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                        <Text style={s.metaText}>{f.city}</Text>
                      </View>
                    )}
                    <View style={s.metaItem}>
                      <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
                      <Text style={s.metaText}>{new Date(f.date).toLocaleDateString('pt-BR')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={s.emptySection}>
            <View style={s.emptyIcon}>
              <Ionicons name="flash-outline" size={40} color={colors.textPlaceholder} />
            </View>
            <Text style={s.emptyTitle}>Nenhum amistoso encontrado</Text>
            <Text style={s.emptyText}>
              {filter === 'ALL'
                ? 'Solicite um amistoso para encontrar adversários'
                : 'Nenhum amistoso com esse filtro'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Team search modal */}
      <Modal visible={showSearch} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSearch(false)}>
        <View style={s.searchContainer}>
          <HeroHeader title="BUSCAR TIME" watermark="SEARCH" onBack={() => setShowSearch(false)} rounded />
          <View style={s.searchInputWrap}>
            <Ionicons name="search" size={20} color={colors.textPlaceholder} />
            <TextInput
              style={s.searchInputField}
              value={searchQuery}
              onChangeText={handleTeamSearch}
              placeholder="Nome do time..."
              placeholderTextColor={colors.textPlaceholder}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                <Ionicons name="close-circle" size={18} color={colors.textPlaceholder} />
              </TouchableOpacity>
            )}
          </View>
          {searching ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
              {searchResults.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={s.searchResultCard}
                  onPress={() => selectTeamAndCreate(team)}
                  activeOpacity={0.7}
                >
                  <TeamAvatar avatarUrl={team.avatarUrl} name={team.name} size={36} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={s.searchResultName}>{team.name}</Text>
                    <Text style={s.searchResultMeta}>{team._count?.members ?? 0} membros</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textPlaceholder} />
                </TouchableOpacity>
              ))}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <Text style={s.searchEmpty}>Nenhum time encontrado</Text>
              )}
              {searchQuery.length < 2 && (
                <Text style={s.searchEmpty}>Digite ao menos 2 caracteres para buscar</Text>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  filterWrap: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },

  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120, paddingTop: spacing.lg, gap: spacing.lg },
  list: { gap: spacing.md },

  // Card
  card: {
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.xl,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  cardTop: { marginBottom: spacing.md },

  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: spacing.lg },
  teamBlock: { alignItems: 'center', flex: 1 },
  teamName: { fontSize: typography.sizes.md, fontFamily: fonts.text.semiBold, color: colors.text, textAlign: 'center', marginTop: spacing.sm },
  vs: { fontSize: typography.sizes.subtitle, fontFamily: fonts.title.regular, color: colors.primary, letterSpacing: typography.letterSpacing.medium },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: typography.sizes.md, color: colors.textMuted, fontFamily: fonts.text.regular },

  // Empty
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

  // Search modal
  searchContainer: { flex: 1, backgroundColor: colors.background },
  searchInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.inputBackground,
    paddingHorizontal: spacing.lg, height: 48,
    marginHorizontal: spacing.xl, marginBottom: spacing.lg, marginTop: spacing.lg,
  },
  searchInputField: { flex: 1, color: colors.text, fontFamily: fonts.form.regular, fontSize: typography.sizes.input, height: 48 },
  searchResultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.card,
    padding: spacing.lg, marginBottom: spacing.sm,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  searchResultName: { fontSize: typography.sizes.input, fontFamily: fonts.text.semiBold, color: colors.text },
  searchResultMeta: { fontSize: typography.sizes.md, fontFamily: fonts.text.regular, color: colors.textMuted, marginTop: 2 },
  searchEmpty: { fontSize: typography.sizes.body, color: colors.textMuted, fontFamily: fonts.text.regular, textAlign: 'center', marginTop: spacing.xl },
});
