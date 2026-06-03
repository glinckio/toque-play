import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import TeamAvatar from '../../components/TeamAvatar';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { teamService } from '../../services/team';
import type { TeamInvitation } from '../../types/team';

export default function NotificationsScreen({ onAvatarPress }: { onAvatarPress?: () => void }) {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      const data = await teamService.findPendingInvitations();
      setInvitations(data);
    } catch {
      setInvitations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchInvitations();
    }, [fetchInvitations]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvitations();
  };

  const handleAccept = async (id: string) => {
    setResponding(id);
    try {
      await teamService.acceptInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível aceitar o convite');
    } finally {
      setResponding(null);
    }
  };

  const handleReject = async (id: string) => {
    setResponding(id);
    try {
      await teamService.rejectInvitation(id);
      setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível recusar o convite');
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.root}>
        <AppHeader title="NOTIFICAÇÕES" showAvatar onAvatarPress={onAvatarPress} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppHeader title="NOTIFICAÇÕES" showAvatar onAvatarPress={onAvatarPress} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {invitations.length > 0 ? (
          <View style={styles.list}>
            {invitations.map((inv) => (
              <View key={inv.id} style={styles.card}>
                {/* Team icon */}
                <TeamAvatar avatarUrl={inv.team.avatarUrl} name={inv.team.name} size={40} />

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{inv.team.name}</Text>
                  <Text style={styles.cardSub} numberOfLines={1}>
                    Convite de {inv.team.owner.name}
                  </Text>
                  <Text style={styles.cardDate}>
                    {new Date(inv.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn]}
                    onPress={() => handleReject(inv.id)}
                    disabled={responding === inv.id}
                    activeOpacity={0.7}
                  >
                    {responding === inv.id ? (
                      <ActivityIndicator color={colors.error} size="small" />
                    ) : (
                      <Ionicons name="close" size={18} color={colors.error} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn]}
                    onPress={() => handleAccept(inv.id)}
                    disabled={responding === inv.id}
                    activeOpacity={0.7}
                  >
                    {responding === inv.id ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptySection}>
            <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>TUDO EM DIA</Text>
            <Text style={styles.emptyText}>Nenhuma notificação pendente</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: { gap: spacing.md, marginTop: spacing.xl },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  teamIcon: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  teamIconGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamIconLetter: {
    fontFamily: fonts.title.display,
    fontSize: 20,
    color: colors.text,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  cardDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.25)',
    fontFamily: fonts.text.regular,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    backgroundColor: 'rgba(255,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
  },
  acceptBtn: {
    backgroundColor: colors.success,
  },

  emptySection: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.hero * 2,
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fonts.title.display,
    fontSize: 24,
    color: colors.text,
    letterSpacing: 3,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: fonts.text.regular,
    paddingHorizontal: spacing.xl,
  },
});
