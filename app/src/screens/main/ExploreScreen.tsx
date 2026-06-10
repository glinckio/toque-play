import React, { useState, useCallback } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { tournamentService } from '../../services/tournament';
import { friendlyService } from '../../services/friendly';
import type { Tournament } from '../../types/tournament';
import type { Friendly } from '../../types/friendly';
import type { RootStackParamList } from '../../navigation/types';
import TabBar from '../../components/TabBar';
import TournamentCard from '../../components/cards/TournamentCard';
import FriendlyCard from '../../components/cards/FriendlyCard';

type Tab = 'tournaments' | 'friendlies';

const MODALITY_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Praia', value: 'BEACH' },
  { label: 'Quadra', value: 'COURT' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<Tab>('tournaments');
  const [search, setSearch] = useState('');
  const [modality, setModality] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [friendlies, setFriendlies] = useState<Friendly[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = useCallback(async () => {
    const query: Record<string, string> = {};
    if (search) query.search = search;
    if (modality) query.modality = modality;
    try {
      const data = await tournamentService.explore(Object.keys(query).length > 0 ? query : undefined);
      setTournaments(data);
    } catch {
      setTournaments([]);
    }
  }, [search, modality]);

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

  const tournCount = tournaments.length;
  const friendlyCount = friendlies.length;

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[0]}
      >
        {/* Header section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>EXPLORAR</Text>
          <Text style={styles.pageSubtitle}>Encontre torneios e amistosos perto de você</Text>

          {/* Search + filter */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color={colors.textPlaceholder} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nome ou cidade"
                placeholderTextColor={colors.textPlaceholder}
                value={search}
                onChangeText={setSearch}
                returnKeyType="search"
              />
              {!!search && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={16} color={colors.textPlaceholder} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
              <Ionicons name="options-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Location + modality pills */}
          <View style={styles.filtersRow}>
            <View style={styles.locationTag}>
              <Ionicons name="location-outline" size={11} color={colors.textMuted} />
              <Text style={styles.locationText}>Sua cidade</Text>
            </View>
            {MODALITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.modalityPill, modality === opt.value && styles.modalityPillActive]}
                onPress={() => setModality(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalityPillText, modality === opt.value && styles.modalityPillTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab bar */}
          <View style={styles.tabWrap}>
            <TabBar
              tabs={[
                { key: 'tournaments', label: 'Torneios', count: tournCount },
                { key: 'friendlies', label: 'Amistosos', count: friendlyCount },
              ]}
              activeTab={tab}
              onTabChange={(key) => setTab(key as Tab)}
            />
          </View>
        </View>

        {/* Content */}
        {tab === 'tournaments' ? (
          tournaments.length > 0 ? (
            <View style={styles.list}>
              {tournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  tournament={t}
                  onPress={() => rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: t.id } })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="search-outline" size={48} color={colors.textPlaceholder} />
              <Text style={styles.emptyText}>Nenhum torneio encontrado</Text>
            </View>
          )
        ) : (
          friendlies.length > 0 ? (
            <View style={styles.list}>
              {friendlies.map((f) => (
                <FriendlyCard
                  key={f.id}
                  friendly={f}
                  onPress={() => rootNav.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: f.id } })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="flash-outline" size={48} color={colors.textPlaceholder} />
              <Text style={styles.emptyText}>Nenhum amistoso disponível</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 120 },

  // ─── Header ─────────────────────────────
  headerSection: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  pageTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 30,
    color: colors.text,
    letterSpacing: 0.3,
  },
  pageSubtitle: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },

  // ─── Search ─────────────────────────────
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECF0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontFamily: fonts.text.regular,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(109,46,192,0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },

  // ─── Filters ────────────────────────────
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECF0',
  },
  locationText: {
    fontFamily: fonts.text.semiBold,
    fontSize: 11,
    color: colors.textMuted,
  },
  modalityPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECF0',
  },
  modalityPillActive: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  modalityPillText: {
    fontFamily: fonts.text.semiBold,
    fontSize: 11,
    color: colors.textMuted,
  },
  modalityPillTextActive: {
    color: '#FFFFFF',
  },

  // ─── Tab ────────────────────────────────
  tabWrap: {
    marginTop: 20,
  },

  // ─── List ───────────────────────────────
  list: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },

  emptySection: {
    alignItems: 'center',
    paddingTop: 60,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textPlaceholder,
  },
});
