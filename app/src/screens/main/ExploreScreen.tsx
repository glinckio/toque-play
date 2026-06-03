import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { tournamentService } from '../../services/tournament';
import { friendlyService } from '../../services/friendly';
import { FRIENDLY_STATUS_LABELS } from '../../types/friendly';
import type { Tournament } from '../../types/tournament';
import type { Friendly } from '../../types/friendly';
import type { RootStackParamList } from '../../navigation/types';

type Tab = 'tournaments' | 'friendlies';
type FilterKey = 'type' | 'format' | 'modality';

const FILTERS: Record<FilterKey, { label: string; value: string }[]> = {
  type: [
    { label: 'Masc', value: 'MALE' },
    { label: 'Fem', value: 'FEMALE' },
    { label: 'Misto', value: 'MIX' },
  ],
  format: [
    { label: 'Dupla', value: 'PAIR' },
    { label: 'Quarteto', value: 'QUARTET' },
    { label: 'Sexteto', value: 'SEXTET' },
  ],
  modality: [
    { label: 'Areia', value: 'BEACH' },
    { label: 'Quadra', value: 'COURT' },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#888',
  PUBLISHED: '#4CAF50',
  REGISTRATION_OPEN: '#4CAF50',
  REGISTRATION_CLOSED: '#FF9800',
  BRACKET_GENERATED: '#2196F3',
  IN_PROGRESS: '#FF4444',
  FINISHED: '#888',
  CANCELLED: '#666',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  REGISTRATION_OPEN: 'Inscrições Abertas',
  REGISTRATION_CLOSED: 'Inscrições Fechadas',
  BRACKET_GENERATED: 'Chaves Geradas',
  IN_PROGRESS: 'Em Andamento',
  FINISHED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

export default function ExploreScreen({ onAvatarPress }: { onAvatarPress?: () => void }) {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<Tab>('tournaments');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<FilterKey, string>>({ type: '', format: '', modality: '' });
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [friendlies, setFriendlies] = useState<Friendly[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = useCallback(async () => {
    const query: Record<string, string> = {};
    if (search) query.search = search;
    if (filters.type) query.type = filters.type;
    if (filters.format) query.format = filters.format;
    if (filters.modality) query.modality = filters.modality;

    try {
      const data = await tournamentService.explore(Object.keys(query).length > 0 ? query : undefined);
      setTournaments(data);
    } catch {
      setTournaments([]);
    }
  }, [search, filters]);

  const fetchFriendlies = useCallback(async () => {
    try {
      const data = await friendlyService.explore();
      setFriendlies(data);
    } catch {
      setFriendlies([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (tab === 'tournaments') {
        fetchTournaments().finally(() => { setLoading(false); });
      } else {
        fetchFriendlies().finally(() => { setLoading(false); });
      }
    }, [tab, fetchTournaments, fetchFriendlies]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    if (tab === 'tournaments') {
      fetchTournaments().finally(() => setRefreshing(false));
    } else {
      fetchFriendlies().finally(() => setRefreshing(false));
    }
  };

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  return (
    <View style={styles.root}>
      <AppHeader title="EXPLORAR" showAvatar onAvatarPress={onAvatarPress} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar torneios..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 'tournaments' && styles.tabActive]}
            onPress={() => setTab('tournaments')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === 'tournaments' && styles.tabTextActive]}>
              TORNEIOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'friendlies' && styles.tabActive]}
            onPress={() => setTab('friendlies')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, tab === 'friendlies' && styles.tabTextActive]}>
              AMISTOSOS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters (tournaments only) */}
        {tab === 'tournaments' && (
          <View style={styles.filtersSection}>
            {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
              <View key={key} style={styles.filterGroup}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterRow}>
                    {FILTERS[key].map((f) => (
                      <TouchableOpacity
                        key={f.value}
                        style={[styles.filterChip, filters[key] === f.value && styles.filterChipActive]}
                        onPress={() => toggleFilter(key, f.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.filterChipText, filters[key] === f.value && styles.filterChipTextActive]}>
                          {f.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </View>
        )}

        {/* Content */}
        {tab === 'tournaments' ? (
          tournaments.length > 0 ? (
            <View style={styles.list}>
              {tournaments.map((t) => {
                const stage = t.stages?.[0];
                const cat = t.categories?.[0];
                const regCount = (t as any)._count?.registrations ?? (t as any).registrationCount ?? 0;
                const maxT = (stage as any)?.maxTeams ?? 0;
                const remaining = maxT > 0 ? maxT - regCount : null;
                return (
                  <TouchableOpacity key={t.id} style={styles.card} activeOpacity={0.7}
                    onPress={() => rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: t.id } })}
                  >
                    {/* Status badge */}
                    <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[t.status] ?? '#888') + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[t.status] ?? '#888' }]} />
                      <Text style={[styles.statusText, { color: STATUS_COLORS[t.status] ?? '#888' }]}>
                        {STATUS_LABELS[t.status] ?? t.status}
                      </Text>
                    </View>

                    <Text style={styles.cardTitle} numberOfLines={2}>{t.name}</Text>

                    {t.description && (
                      <Text style={styles.cardDesc} numberOfLines={2}>{t.description}</Text>
                    )}

                    {/* Meta row */}
                    <View style={styles.metaRow}>
                      {(stage?.street || stage?.city) && (
                        <View style={styles.metaItem}>
                          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                          <Text style={styles.metaText} numberOfLines={1}>
                            {[stage.street, stage.number].filter(Boolean).join(', ')}{stage.neighborhood ? `, ${stage.neighborhood}` : ''}{stage.city ? ` — ${stage.city}` : ''}{stage.state ? `/${stage.state}` : ''}
                          </Text>
                        </View>
                      )}
                      {cat && (
                        <View style={styles.metaItem}>
                          <Ionicons name="layers-outline" size={14} color={colors.textMuted} />
                          <Text style={styles.metaText}>
                            {cat.modality === 'BEACH' ? 'Areia' : 'Quadra'} · {cat.format === 'PAIR' ? 'Dupla' : cat.format === 'QUARTET' ? 'Quarteto' : 'Sexteto'}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Bottom row */}
                    <View style={styles.cardBottom}>
                      {stage?.date && (
                        <Text style={styles.cardDate}>
                          {new Date(stage.date).toLocaleDateString('pt-BR')}
                        </Text>
                      )}
                      <View style={styles.regBadge}>
                        <Ionicons name="people" size={13} color={colors.primaryGlow} />
                        <Text style={styles.regText}>
                          {maxT > 0 ? `${regCount}/${maxT}` : `${regCount} inscrito${regCount !== 1 ? 's' : ''}`}
                        </Text>
                      </View>
                      {remaining !== null && remaining > 0 && (
                        <Text style={styles.remainingText}>
                          {remaining} vaga{remaining !== 1 ? 's' : ''}
                        </Text>
                      )}
                      {remaining === 0 && (
                        <Text style={[styles.remainingText, { color: colors.error }]}>Lotado</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum torneio encontrado</Text>
              <Text style={styles.emptyText}>Tente ajustar os filtros ou buscar por outro termo</Text>
            </View>
          )
        ) : (
          friendlies.length > 0 ? (
            <View style={styles.list}>
              {friendlies.map((f) => (
                <TouchableOpacity key={f.id} style={styles.card} activeOpacity={0.7}
                      onPress={() => rootNav.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: f.id } })}
                    >
                  <View style={[styles.statusBadge, { backgroundColor: (f.status === 'ACCEPTED' ? '#4CAF50' : f.status === 'PENDING' ? '#FF9800' : '#888') + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: f.status === 'ACCEPTED' ? '#4CAF50' : f.status === 'PENDING' ? '#FF9800' : '#888' }]} />
                    <Text style={[styles.statusText, { color: f.status === 'ACCEPTED' ? '#4CAF50' : f.status === 'PENDING' ? '#FF9800' : '#888' }]}>
                      {FRIENDLY_STATUS_LABELS[f.status] ?? f.status}
                    </Text>
                  </View>

                  <Text style={styles.cardTitle}>
                    {f.title ?? `${f.requesterTeam?.name ?? 'Time A'} vs ${f.challengedTeam?.name ?? 'Time B'}`}
                  </Text>

                  <View style={styles.metaRow}>
                    {f.city && (
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                        <Text style={styles.metaText}>{f.city}</Text>
                      </View>
                    )}
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                      <Text style={styles.metaText}>{new Date(f.date).toLocaleDateString('pt-BR')}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="flash-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum amistoso disponível</Text>
              <Text style={styles.emptyText}>Crie um amistoso para encontrar adversários</Text>
            </View>
          )
        )}
      </ScrollView>

      {tab === 'friendlies' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => rootNav.navigate('Friendly', { screen: 'CreateFriendly' })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryGlow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.text.regular,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.textMuted,
    fontFamily: fonts.text.semiBold,
  },
  tabTextActive: {
    color: colors.text,
  },

  // Filters
  filtersSection: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  filterGroup: {},
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(109,46,192,0.15)',
    borderColor: 'rgba(157,115,230,0.3)',
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.text.medium,
  },
  filterChipTextActive: {
    color: colors.primaryGlow,
  },

  // List
  list: {
    gap: spacing.md,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontFamily: fonts.text.semiBold,
  },
  cardTitle: {
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    paddingTop: spacing.md,
  },
  cardDate: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  regBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(109,46,192,0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  regText: {
    fontSize: 12,
    color: colors.primaryGlow,
    fontFamily: fonts.text.semiBold,
  },
  remainingText: {
    fontSize: 11,
    color: colors.success,
    fontFamily: fonts.text.medium,
    marginLeft: spacing.sm,
  },

  // Empty
  emptySection: {
    alignItems: 'center',
    paddingTop: spacing.hero * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    zIndex: 10,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
