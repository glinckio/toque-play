import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { registrationService } from '../../services/registration';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import type { Registration, RegistrationStatus } from '../../types/registration';
import type { RootStackParamList } from '../../navigation/types';
import HeroHeader from '../../components/HeroHeader';

type FilterKey = 'ALL' | 'CONFIRMED' | 'PENDING_PAYMENT' | 'CANCELLED';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ALL', label: 'TODAS' },
  { key: 'CONFIRMED', label: 'CONFIRMADAS' },
  { key: 'PENDING_PAYMENT', label: 'PENDENTES' },
  { key: 'CANCELLED', label: 'CANCELADAS' },
];

const REG_STATUS_COLORS: Record<RegistrationStatus, string> = {
  PENDING_PAYMENT: '#FF9800',
  PENDING_CONFIRMATION: '#FF9800',
  CONFIRMED: '#4CAF50',
  CANCELLED: '#666',
  REJECTED: colors.error,
};

const REG_STATUS_LABELS: Record<RegistrationStatus, string> = {
  PENDING_PAYMENT: 'Pagamento Pendente',
  PENDING_CONFIRMATION: 'Confirmação Pendente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  REJECTED: 'Rejeitada',
};

const TOURNAMENT_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  REGISTRATION_OPEN: 'Inscrições Abertas',
  REGISTRATION_CLOSED: 'Fechadas',
  BRACKET_GENERATED: 'Chaves Geradas',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Finalizado',
  CANCELLED: 'Cancelado',
};

export default function MyRegistrationsScreen({ navigation }: any) {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const data = await registrationService.listMine();
      setRegistrations(data);
    } catch {
      setRegistrations([]);
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
    ? registrations
    : registrations.filter((r) => r.status === filter);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <HeroHeader
        title="MINHAS INSCRIÇÕES"
        subtitle={`${registrations.length} inscrição${registrations.length !== 1 ? 'ões' : ''}`}
        watermark="REGS"
        onBack={() => navigation.goBack()}
        rounded
      />

      {/* Filter */}
      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f.key} style={[s.filterTab, filter === f.key && s.filterTabActive]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
            <Text style={[s.filterTabText, filter === f.key && s.filterTabTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
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
            {filtered.map((reg) => {
              const regColor = REG_STATUS_COLORS[reg.status] ?? '#888';
              const tStatus = reg.tournament?.status ?? '';
              return (
                <TouchableOpacity
                  key={reg.id}
                  style={s.card}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (reg.tournament?.id) {
                      rootNav.navigate('Tournament', { screen: 'TournamentDetail', params: { tournamentId: reg.tournament.id } });
                    }
                  }}
                >
                  {/* Registration status */}
                  <View style={[s.statusBadge, { backgroundColor: regColor + '20' }]}>
                    <View style={[s.statusDot, { backgroundColor: regColor }]} />
                    <Text style={[s.statusText, { color: regColor }]}>{REG_STATUS_LABELS[reg.status]}</Text>
                  </View>

                  {/* Tournament name */}
                  <Text style={s.cardTitle} numberOfLines={2}>
                    {reg.tournament?.name ?? 'Torneio'}
                  </Text>

                  {/* Category & team */}
                  <View style={s.metaRow}>
                    {reg.category && (
                      <View style={s.metaItem}>
                        <Ionicons name="layers-outline" size={14} color={colors.textMuted} />
                        <Text style={s.metaText}>
                          {reg.category.modality === 'BEACH' ? 'Areia' : 'Quadra'} · {reg.category.format === 'PAIR' ? 'Dupla' : reg.category.format === 'QUARTET' ? 'Quarteto' : 'Sexteto'}
                        </Text>
                      </View>
                    )}
                    {reg.team && (
                      <View style={s.metaItem}>
                        <Ionicons name="shield-outline" size={14} color={colors.textMuted} />
                        <Text style={s.metaText}>{reg.team.name}</Text>
                      </View>
                    )}
                  </View>

                  {/* Tournament status + date */}
                  <View style={s.cardBottom}>
                    {tStatus && (
                      <Text style={s.tournamentStatus}>
                        Torneio: {TOURNAMENT_STATUS_LABELS[tStatus] ?? tStatus}
                      </Text>
                    )}
                    {reg.tournament?.stages?.[0]?.city && (
                      <Text style={s.locationText}>{reg.tournament.stages[0].city}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={s.emptySection}>
            <Ionicons name="clipboard-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyTitle}>Nenhuma inscrição encontrada</Text>
            <Text style={s.emptyText}>
              {filter === 'ALL'
                ? 'Explore torneios e inscreva sua equipe'
                : `Nenhuma inscrição ${REG_STATUS_LABELS[filter as RegistrationStatus]?.toLowerCase() ?? ''}`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  // Filter
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, marginBottom: spacing.lg, gap: spacing.sm },
  filterTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 2, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  filterTabActive: { backgroundColor: 'rgba(109,46,192,0.15)', borderColor: 'rgba(157,115,230,0.3)' },
  filterTabText: { fontSize: 11, fontFamily: fonts.text.semiBold, color: colors.textMuted, letterSpacing: 1 },
  filterTabTextActive: { color: colors.primaryLight },

  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  center: { alignItems: 'center', paddingTop: spacing.hero },
  loadingText: { color: colors.textMuted, fontFamily: fonts.text.regular },
  list: { gap: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', padding: spacing.xl },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 8, marginBottom: spacing.md },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, letterSpacing: 1.5, fontFamily: fonts.text.semiBold },
  cardTitle: { fontSize: 16, fontFamily: fonts.text.semiBold, color: colors.text, lineHeight: 20, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: spacing.md },
  tournamentStatus: { fontSize: 11, color: colors.textSecondary, fontFamily: fonts.text.regular },
  locationText: { fontSize: 11, color: colors.textMuted, fontFamily: fonts.text.regular },
  emptySection: { alignItems: 'center', paddingTop: spacing.hero * 2, gap: spacing.md },
  emptyTitle: { fontSize: 16, fontFamily: fonts.text.semiBold, color: colors.text },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', fontFamily: fonts.text.regular, paddingHorizontal: spacing.xl, lineHeight: 18 },
});
