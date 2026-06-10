import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tournamentService } from '../../services/tournament';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import HeroHeader from '../../components/HeroHeader';
import TabBar from '../../components/TabBar';
import StatusBadge from '../../components/StatusBadge';
import type { Tournament, TournamentStatus } from '../../types/tournament';
import type { RootStackParamList } from '../../navigation/types';

type FilterKey = 'ALL' | TournamentStatus;

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'ALL', label: 'Todos' },
  { key: 'DRAFT', label: 'Rascunho' },
  { key: 'REGISTRATION_OPEN', label: 'Abertos' },
  { key: 'IN_PROGRESS', label: 'Ao vivo' },
  { key: 'COMPLETED', label: 'Finalizados' },
];

export default function MyTournamentsScreen({ navigation }: any) {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const data = await tournamentService.findMine();
      setTournaments(data);
    } catch {
      setTournaments([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetch().finally(() => { setLoading(false); });
    }, [fetch]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetch().finally(() => setRefreshing(false));
  };

  const filtered = filter === 'ALL'
    ? tournaments
    : tournaments.filter((t) => t.status === filter);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <HeroHeader
        title="MEUS TORNEIOS"
        subtitle={`${tournaments.length} torneio${tournaments.length !== 1 ? 's' : ''}`}
        watermark="TOURNEYS"
        onBack={() => navigation.goBack()}
        rounded
      />

      {/* Filter */}
      <View style={s.filterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TabBar
            tabs={FILTER_TABS.map((f) => ({ key: f.key, label: f.label }))}
            activeTab={filter}
            onTabChange={(key) => setFilter(key as FilterKey)}
            variant="pill"
          />
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {loading ? (
          <View style={s.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : filtered.length > 0 ? (
          <View style={s.list}>
            {filtered.map((t) => {
              const stage = t.stages?.[0];
              const regCount = t._count?.registrations ?? t.registrationCount ?? 0;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={s.card}
                  activeOpacity={0.7}
                  onPress={() => rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: t.id } })}
                >
                  <View style={s.cardTop}>
                    <StatusBadge status={t.status} size="sm" />
                    <View style={s.regBadge}>
                      <Ionicons name="people" size={13} color={colors.primary} />
                      <Text style={s.regText}>{regCount}</Text>
                    </View>
                  </View>

                  <Text style={s.cardTitle} numberOfLines={2}>{t.name}</Text>

                  <View style={s.metaRow}>
                    {(stage?.street || stage?.city) && (
                      <View style={s.metaItem}>
                        <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                        <Text style={s.metaText} numberOfLines={1}>
                          {[stage.street, stage.number].filter(Boolean).join(', ')}{stage.neighborhood ? `, ${stage.neighborhood}` : ''}{stage.city ? ` — ${stage.city}` : ''}{stage.state ? `/${stage.state}` : ''}
                        </Text>
                      </View>
                    )}
                    {stage?.date && (
                      <View style={s.metaItem}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                        <Text style={s.metaText}>{new Date(stage.date).toLocaleDateString('pt-BR')}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={s.emptySection}>
            <View style={s.emptyIcon}>
              <Ionicons name="trophy-outline" size={40} color={colors.textPlaceholder} />
            </View>
            <Text style={s.emptyTitle}>Nenhum torneio encontrado</Text>
            <Text style={s.emptyText}>
              {filter === 'ALL'
                ? 'Crie seu primeiro torneio e comece a organizar competições'
                : 'Nenhum torneio com esse filtro'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  filterWrap: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },

  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  center: { alignItems: 'center', paddingTop: spacing.hero },

  list: { gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  regBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  regText: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontFamily: fonts.text.semiBold,
  },
  cardTitle: {
    fontSize: typography.sizes.button,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },

  emptySection: { alignItems: 'center', paddingTop: 80, gap: spacing.md },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
