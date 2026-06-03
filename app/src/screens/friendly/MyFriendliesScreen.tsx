import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
  TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { friendlyService } from '../../services/friendly';
import { teamService } from '../../services/team';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { Team } from '../../types/team';
import TeamAvatar from '../../components/TeamAvatar';
import type { Friendly } from '../../types/friendly';
import { FriendlyStatus, FRIENDLY_STATUS_LABELS } from '../../types/friendly';
import type { RootStackParamList } from '../../navigation/types';

type FilterTab = 'ALL' | FriendlyStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'TODOS' },
  { key: FriendlyStatus.PENDING, label: 'PENDENTES' },
  { key: FriendlyStatus.ACCEPTED, label: 'ACEITOS' },
  { key: FriendlyStatus.COMPLETED, label: 'CONCLUÍDOS' },
];

const STATUS_COLORS: Record<string, string> = {
  [FriendlyStatus.PENDING]: '#FF9800',
  [FriendlyStatus.ACCEPTED]: '#4CAF50',
  [FriendlyStatus.REJECTED]: colors.error,
  [FriendlyStatus.CANCELLED]: colors.textMuted,
  [FriendlyStatus.COMPLETED]: colors.primaryGlow,
};

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
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>MEUS AMISTOSOS</Text>
      </View>

      {/* Filter tabs */}
      <View style={s.filterRow}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[s.filterTab, filter === tab.key && s.filterTabActive]}
            onPress={() => setFilter(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[s.filterTabText, filter === tab.key && s.filterTabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {/* Request friendly button */}
        <TouchableOpacity style={s.requestBtn} onPress={() => { setShowSearch(true); setSearchQuery(''); setSearchResults([]); }} activeOpacity={0.8}>
          <LinearGradient colors={[colors.primary, colors.primaryGlow]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.requestGradient}>
            <Ionicons name="flash" size={18} color={colors.text} />
            <Text style={s.requestText}>SOLICITAR AMISTOSO</Text>
          </LinearGradient>
        </TouchableOpacity>

        {filtered.length > 0 ? (
          <View style={s.list}>
            {filtered.map((f) => {
              const nameA = f.requesterTeam?.name ?? 'Time A';
              const nameB = f.challengedTeam?.name ?? 'A definir';
              const color = STATUS_COLORS[f.status] ?? colors.textMuted;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={s.card}
                  activeOpacity={0.7}
                  onPress={() => rootNav.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: f.id } })}
                >
                  <View style={[s.statusBadge, { backgroundColor: color + '20' }]}>
                    <View style={[s.statusDot, { backgroundColor: color }]} />
                    <Text style={[s.statusText, { color: color }]}>{FRIENDLY_STATUS_LABELS[f.status]}</Text>
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
            <Ionicons name="flash-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyTitle}>Nenhum amistoso encontrado</Text>
            <Text style={s.emptyText}>
              {filter === 'ALL'
                ? 'Solicite um amistoso para encontrar adversários'
                : `Nenhum amistoso ${FRIENDLY_STATUS_LABELS[filter as FriendlyStatus]?.toLowerCase() ?? ''}`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Team search modal */}
      <Modal visible={showSearch} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSearch(false)}>
        <View style={s.searchContainer}>
          <View style={s.searchHeader}>
            <TouchableOpacity onPress={() => setShowSearch(false)} style={s.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>BUSCAR TIME</Text>
            <View style={{ width: 40 }} />
          </View>
          <Text style={s.searchHint}>Encontre um time para solicitar o amistoso</Text>
          <View style={s.searchInputWrap}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={s.searchInputField}
              value={searchQuery}
              onChangeText={handleTeamSearch}
              placeholder="Nome do time..."
              placeholderTextColor={colors.textMuted}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
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
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md },
  backBtn: { padding: 8, marginRight: spacing.sm },
  headerTitle: { fontSize: 20, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2 },

  // Filter
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.lg, gap: spacing.sm },
  filterTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 2, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  filterTabActive: { backgroundColor: 'rgba(109,46,192,0.15)', borderColor: 'rgba(157,115,230,0.3)' },
  filterTabText: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1 },
  filterTabTextActive: { color: colors.primaryGlow },

  // Request button
  requestBtn: { marginHorizontal: spacing.xl, marginBottom: spacing.xl, borderRadius: 16, overflow: 'hidden' },
  requestGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  requestText: { fontSize: 14, fontFamily: fonts.text.bold, color: colors.text, letterSpacing: 2 },

  scrollContent: { paddingBottom: 120 },
  list: { paddingHorizontal: spacing.xl, gap: spacing.md },

  // Card
  card: {
    backgroundColor: colors.surface, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.xl, overflow: 'hidden',
  },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 8, marginBottom: spacing.md },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, letterSpacing: 1.5, fontFamily: fonts.text.semiBold },

  // Teams in card
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: spacing.lg },
  teamBlock: { alignItems: 'center', flex: 1 },
  teamCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  teamInitial: { fontSize: 18, fontFamily: fonts.title.display, color: colors.text },
  teamName: { fontSize: 12, fontFamily: fonts.text.semiBold, color: colors.text, textAlign: 'center' },
  vs: { fontSize: 14, fontFamily: fonts.title.display, color: colors.primaryGlow, letterSpacing: 2 },

  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: colors.textMuted, fontFamily: fonts.text.regular },

  // Empty
  emptySection: { alignItems: 'center', paddingTop: spacing.hero * 2, gap: spacing.md, paddingHorizontal: spacing.xl },
  emptyTitle: { fontSize: 16, fontFamily: fonts.text.semiBold, color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', fontFamily: fonts.text.regular, lineHeight: 18 },

  // Search modal
  searchContainer: { flex: 1, backgroundColor: colors.background },
  searchHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, marginBottom: spacing.sm },
  searchHint: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  searchInputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg, height: 50,
    marginHorizontal: spacing.xl, marginBottom: spacing.lg,
  },
  searchInputField: { flex: 1, color: colors.text, fontFamily: fonts.text.regular, fontSize: 14, height: 50 },
  searchResultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.lg, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  searchResultAvatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  searchResultInitial: { fontSize: 18, fontFamily: fonts.title.display, color: colors.text },
  searchResultName: { fontSize: 14, fontFamily: fonts.text.semiBold, color: colors.text },
  searchResultMeta: { fontSize: 11, fontFamily: fonts.text.regular, color: colors.textMuted, marginTop: 2 },
  searchEmpty: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.text.regular, textAlign: 'center', marginTop: spacing.xl },
});
