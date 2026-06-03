import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tournamentService } from '../../services/tournament';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { Tournament, TournamentStatus } from '../../types/tournament';
import type { RootStackParamList } from '../../navigation/types';

type FilterKey = 'ALL' | TournamentStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ALL', label: 'TODOS' },
  { key: 'IN_PROGRESS', label: 'EM ANDAMENTO' },
  { key: 'BRACKET_GENERATED', label: 'CHAVES GERADAS' },
  { key: 'REGISTRATION_OPEN', label: 'INSCRIÇÕES ABERTAS' },
  { key: 'COMPLETED', label: 'FINALIZADOS' },
  { key: 'DRAFT', label: 'RASCUNHOS' },
];

const STATUS_COLORS: Record<TournamentStatus, string> = {
  DRAFT: '#888',
  PUBLISHED: '#4CAF50',
  REGISTRATION_OPEN: '#4CAF50',
  REGISTRATION_CLOSED: '#FF9800',
  BRACKET_GENERATED: '#2196F3',
  IN_PROGRESS: '#FF4444',
  COMPLETED: '#9D73E6',
  CANCELLED: '#666',
};

const STATUS_LABELS: Record<TournamentStatus, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  REGISTRATION_OPEN: 'Inscrições Abertas',
  REGISTRATION_CLOSED: 'Inscrições Fechadas',
  BRACKET_GENERATED: 'Chaves Geradas',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

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
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>MEUS TORNEIOS</Text>
      </View>

      {/* Filter */}
      <View style={s.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f.key} style={[s.filterTab, filter === f.key && s.filterTabActive]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
              <Text style={[s.filterTabText, filter === f.key && s.filterTabTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {loading ? (
          <View style={s.center}>
            <Text style={s.loadingText}>Carregando...</Text>
          </View>
        ) : filtered.length > 0 ? (
          <View style={s.list}>
            {filtered.map((t) => {
              const stage = t.stages?.[0];
              const regCount = t._count?.registrations ?? t.registrationCount ?? 0;
              const statusColor = STATUS_COLORS[t.status] ?? '#888';
              return (
                <TouchableOpacity
                  key={t.id}
                  style={s.card}
                  activeOpacity={0.7}
                  onPress={() => rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: t.id } })}
                >
                  <View style={[s.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <View style={[s.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[s.statusText, { color: statusColor }]}>{STATUS_LABELS[t.status] ?? t.status}</Text>
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

                  <View style={s.cardBottom}>
                    <View style={s.regBadge}>
                      <Ionicons name="people" size={13} color={colors.primaryGlow} />
                      <Text style={s.regText}>{regCount} inscrito{regCount !== 1 ? 's' : ''}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={s.emptySection}>
            <Ionicons name="trophy-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyTitle}>Nenhum torneio encontrado</Text>
            <Text style={s.emptyText}>
              {filter === 'ALL'
                ? 'Crie seu primeiro torneio e comece a organizar competições'
                : `Nenhum torneio ${STATUS_LABELS[filter as TournamentStatus]?.toLowerCase() ?? ''}`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB Criar Torneio */}
      <TouchableOpacity
        style={s.fab}
        activeOpacity={0.8}
        onPress={() => {
          rootNav.navigate('Tournament', { screen: 'CreateTournament' });
        }}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryGlow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.fabGradient}
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2 },

  // Filter
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  filterTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 2, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', marginRight: spacing.sm },
  filterTabActive: { backgroundColor: 'rgba(109,46,192,0.15)', borderColor: 'rgba(157,115,230,0.3)' },
  filterTabText: { fontSize: 10, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1 },
  filterTabTextActive: { color: colors.primaryGlow },

  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  center: { alignItems: 'center', paddingTop: spacing.hero },
  loadingText: { color: colors.textMuted, fontFamily: fonts.text.regular },
  list: { gap: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', padding: spacing.xl },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 8, marginBottom: spacing.md },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, letterSpacing: 1.5, fontFamily: fonts.text.semiBold },
  cardTitle: { fontSize: 16, fontFamily: fonts.text.semiBold, color: colors.text, lineHeight: 20, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: spacing.md },
  regBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(109,46,192,0.1)', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 8 },
  regText: { fontSize: 12, color: colors.primaryGlow, fontFamily: fonts.text.semiBold },
  emptySection: { alignItems: 'center', paddingTop: spacing.hero * 2, gap: spacing.md },
  emptyTitle: { fontSize: 16, fontFamily: fonts.text.semiBold, color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', fontFamily: fonts.text.regular, paddingHorizontal: spacing.xl, lineHeight: 18 },

  // FAB
  fab: { position: 'absolute', right: spacing.xl, bottom: 100, borderRadius: 28, overflow: 'hidden', elevation: 6, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  fabGradient: { width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
});
