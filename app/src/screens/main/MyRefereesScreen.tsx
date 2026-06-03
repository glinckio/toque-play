import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { tournamentService } from '../../services/tournament';
import type { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#666',
  PUBLISHED: '#4CAF50',
  REGISTRATION_OPEN: '#4CAF50',
  BRACKET_GENERATED: '#2196F3',
  IN_PROGRESS: '#FF4444',
  FINISHED: '#888',
};

export default function MyRefereesScreen() {
  const navigation = useNavigation<Nav>();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await tournamentService.findRefereeMine();
      setTournaments(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>MINHAS ARBITRAGENS</Text>
      </View>

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : tournaments.length === 0 ? (
        <View style={s.empty}>
          <Ionicons name="flag-outline" size={48} color={colors.textMuted} />
          <Text style={s.emptyText}>Nenhuma arbitragem encontrada</Text>
          <Text style={s.emptySub}>Quando um organizador te adicionar como arbitro, aparecera aqui</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          showsVerticalScrollIndicator={false}
        >
          {tournaments.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={s.card}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Tournament', {
                screen: 'TournamentDetail',
                params: { tournamentId: t.id },
              })}
            >
              <View style={s.cardHeader}>
                <View style={s.cardIcon}>
                  <Ionicons name="flag" size={20} color={colors.primaryGlow} />
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{t.name}</Text>
                  {t.stages?.[0] && (
                    <Text style={s.cardMeta}>
                      {new Date(t.stages[0].date).toLocaleDateString('pt-BR')}
                    </Text>
                  )}
                </View>
                <View style={[s.statusDot, { backgroundColor: STATUS_COLORS[t.status] ?? '#888' }]} />
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: fonts.title.display, color: colors.text, letterSpacing: 2, flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.md },
  emptyText: { fontSize: 16, fontFamily: fonts.text.semiBold, color: colors.textMuted, textAlign: 'center' },
  emptySub: { fontSize: 13, fontFamily: fonts.text.regular, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(109,46,192,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, color: colors.text, fontFamily: fonts.text.semiBold },
  cardMeta: { fontSize: 12, color: colors.textMuted, fontFamily: fonts.text.regular, marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
});
