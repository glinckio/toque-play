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
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { tournamentService } from '../../services/tournament';
import type { RootStackParamList } from '../../navigation/types';
import HeroHeader from '../../components/HeroHeader';
import StatusBadge from '../../components/StatusBadge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

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
      <HeroHeader
        title="MINHAS ARBITRAGENS"
        subtitle={`${tournaments.length} torneio${tournaments.length !== 1 ? 's' : ''}`}
        watermark="REFEREE"
        onBack={() => navigation.goBack()}
        rounded
      />

      {loading ? (
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : tournaments.length === 0 ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <Ionicons name="flag-outline" size={40} color={colors.textPlaceholder} />
          </View>
          <Text style={s.emptyTitle}>Nenhuma arbitragem encontrada</Text>
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
                  <Ionicons name="flag" size={20} color={colors.primary} />
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{t.name}</Text>
                  {t.stages?.[0] && (
                    <Text style={s.cardMeta}>
                      {new Date(t.stages[0].date).toLocaleDateString('pt-BR')}
                    </Text>
                  )}
                </View>
                <StatusBadge status={t.status} size="sm" />
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
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.md },
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
  emptySub: {
    fontFamily: fonts.text.regular, fontSize: typography.sizes.body,
    color: colors.textMuted, textAlign: 'center', lineHeight: 18,
  },
  list: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: typography.sizes.input, color: colors.text, fontFamily: fonts.text.semiBold },
  cardMeta: { fontSize: typography.sizes.md, color: colors.textMuted, fontFamily: fonts.text.regular, marginTop: 2 },
});
