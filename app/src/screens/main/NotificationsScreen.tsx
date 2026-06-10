import React, { useCallback, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../../services/notification';
import { teamService } from '../../services/team';
import { friendlyService } from '../../services/friendly';
import { useNotifStore } from '../../stores/notifStore';
import type { AppNotification } from '../../types/notification';
import type { TeamInvitation } from '../../types/team';
import ChevronButton from '../../components/ChevronButton';

type NotifType =
  | 'FRIENDLY_REQUEST'
  | 'FRIENDLY_ACCEPTED'
  | 'TOURNAMENT_UPDATE'
  | 'MATCH_REMINDER'
  | 'REFEREE_ASSIGNED'
  | 'TEAM_INVITE';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  FRIENDLY_REQUEST: 'tennisball-outline',
  FRIENDLY_ACCEPTED: 'checkmark-circle-outline',
  TOURNAMENT_UPDATE: 'trophy-outline',
  MATCH_REMINDER: 'notifications-outline',
  REFEREE_ASSIGNED: 'people-outline',
  TEAM_INVITE: 'shield-outline',
};

const ICON_BG_MAP: Record<string, string[]> = {
  FRIENDLY_REQUEST: [colors.primary, colors.primaryLight],
  FRIENDLY_ACCEPTED: [colors.success, '#2DD89B'],
  TOURNAMENT_UPDATE: [colors.primaryDark, colors.primary],
  MATCH_REMINDER: [colors.warning, '#F6C168'],
  REFEREE_ASSIGNED: [colors.dark, colors.darkSecondary],
  TEAM_INVITE: [colors.primary, colors.primaryLight],
};

interface DisplayItem {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  invitationId?: string;
  referenceId?: string | null;
}

function groupByDay(items: DisplayItem[]): Record<string, DisplayItem[]> {
  const groups: Record<string, DisplayItem[]> = {};
  for (const item of items) {
    const d = new Date(item.createdAt);
    const key = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    groups[key] = groups[key] ?? [];
    groups[key].push(item);
  }
  return groups;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);
  const navigation = useNavigation<any>();

  const fetchData = useCallback(async () => {
    try {
      const [notifs, invites] = await Promise.all([
        notificationService.findMine().catch(() => [] as AppNotification[]),
        teamService.findPendingInvitations().catch(() => [] as TeamInvitation[]),
      ]);

      const notifItems: DisplayItem[] = (notifs as AppNotification[]).map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt,
        read: n.read,
        referenceId: n.referenceId,
      }));

      const inviteItems: DisplayItem[] = (invites as TeamInvitation[]).map((inv) => ({
        id: `inv-${inv.id}`,
        type: 'TEAM_INVITE',
        title: `Convite: ${inv.team.name}`,
        body: `${inv.team.owner.name} te convidou para participar do time`,
        createdAt: new Date().toISOString(),
        read: false,
        invitationId: inv.id,
      }));

      setItems([...inviteItems, ...notifItems]);
    } catch {
      setItems([]);
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

  const decrementBadge = () => {
    useNotifStore.getState().setUnreadCount(Math.max(0, useNotifStore.getState().unreadCount - 1));
  };

  const handleAcceptInvite = async (invitationId: string) => {
    setResponding(invitationId);
    try {
      await teamService.acceptInvitation(invitationId);
      setItems((prev) => prev.filter((i) => i.invitationId !== invitationId));
      decrementBadge();
    } catch {
      Alert.alert('Erro', 'Não foi possível aceitar o convite');
    } finally {
      setResponding(null);
    }
  };

  const handleRejectInvite = async (invitationId: string) => {
    setResponding(invitationId);
    try {
      await teamService.rejectInvitation(invitationId);
      setItems((prev) => prev.filter((i) => i.invitationId !== invitationId));
      decrementBadge();
    } catch {
      Alert.alert('Erro', 'Não foi possível recusar o convite');
    } finally {
      setResponding(null);
    }
  };

  const handleAcceptFriendly = async (item: DisplayItem) => {
    if (!item.referenceId) return;
    // Mark notification as read + remove from list
    try { await notificationService.markAsRead(item.id); } catch {}
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    decrementBadge();
    navigation.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: item.referenceId } });
  };

  const handleRejectFriendly = async (item: DisplayItem) => {
    if (!item.referenceId) return;
    setResponding(item.referenceId);
    try {
      await friendlyService.reject(item.referenceId);
      try { await notificationService.markAsRead(item.id); } catch {}
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      decrementBadge();
    } catch {
      Alert.alert('Erro', 'Não foi possível recusar o amistoso');
    } finally {
      setResponding(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setItems([]);
      useNotifStore.getState().setUnreadCount(0);
    } catch {}
  };

  const handleNotificationTap = async (item: DisplayItem) => {
    if (item.id.startsWith('inv-')) return; // invites handled by buttons

    try {
      await notificationService.markAsRead(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      decrementBadge();
    } catch {}

    // Navigate if applicable
    if (item.type === 'FRIENDLY_REQUEST' || item.type === 'FRIENDLY_ACCEPTED') {
      if (item.referenceId) {
        navigation.navigate('Friendly', { screen: 'FriendlyDetail', params: { friendlyId: item.referenceId } });
      }
    }
  };

  const unreadCount = items.filter((i) => !i.read).length;
  const groups = groupByDay(items);

  if (loading) {
    return (
      <View style={styles.root}>
        <View style={{ height: insets.top }} />
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>NOTIFICAÇÕES</Text>
            <Text style={styles.pageSub}>Carregando...</Text>
          </View>
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top }} />
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>NOTIFICAÇÕES</Text>
          <Text style={styles.pageSub}>{unreadCount} não lidas</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllBtn}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {items.length > 0 ? (
          Object.entries(groups).map(([day, dayItems]) => (
            <View key={day} style={styles.dayGroup}>
              <Text style={styles.dayLabel}>{day}</Text>
              <View style={styles.dayList}>
                {dayItems.map((item) => {
                  const icon = ICON_MAP[item.type] ?? 'notifications-outline';
                  const iconBg = ICON_BG_MAP[item.type] ?? [colors.primary, colors.primaryLight];

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.card, !item.read && styles.cardUnread]}
                      onPress={() => handleNotificationTap(item)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconBox, { backgroundColor: iconBg[0] }]}>
                        <Ionicons name={icon} size={18} color="#FFFFFF" />
                      </View>
                      <View style={styles.cardContent}>
                        <View style={styles.cardTitleRow}>
                          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                          {!item.read && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.cardBody} numberOfLines={2}>{item.body}</Text>
                        {item.type === 'FRIENDLY_REQUEST' && (
                          <View style={styles.actionRow}>
                            <ChevronButton
                              variant="success"
                              size="sm"
                              onPress={() => handleAcceptFriendly(item)}
                              disabled={!!responding && responding === item.referenceId}
                            >
                              Aceitar
                            </ChevronButton>
                            <ChevronButton
                              variant="ghost"
                              size="sm"
                              onPress={() => handleRejectFriendly(item)}
                              disabled={!!responding && responding === item.referenceId}
                            >
                              Recusar
                            </ChevronButton>
                          </View>
                        )}
                        {item.type === 'TEAM_INVITE' && (
                          <View style={styles.actionRow}>
                            <ChevronButton
                              variant="success"
                              size="sm"
                              onPress={() => {
                                if (item.invitationId) handleAcceptInvite(item.invitationId);
                              }}
                              disabled={!!responding && responding === item.invitationId}
                            >
                              Aceitar
                            </ChevronButton>
                            <ChevronButton
                              variant="ghost"
                              size="sm"
                              onPress={() => {
                                if (item.invitationId) handleRejectInvite(item.invitationId);
                              }}
                              disabled={!!responding && responding === item.invitationId}
                            >
                              Recusar
                            </ChevronButton>
                          </View>
                        )}
                        <Text style={styles.cardTime}>
                          {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptySection}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-outline" size={40} color={colors.textPlaceholder} />
            </View>
            <Text style={styles.emptyTitle}>Tudo em dia</Text>
            <Text style={styles.emptyText}>Nenhuma notificação pendente</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  pageSub: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  markAllBtn: {
    fontFamily: fonts.text.semiBold,
    fontSize: 12,
    color: colors.primary,
  },

  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  dayGroup: { marginBottom: spacing.xxl },
  dayLabel: {
    fontFamily: fonts.text.bold,
    fontSize: 11,
    color: colors.textPlaceholder,
    letterSpacing: 0.5,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  dayList: { gap: 8 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: 14,
    gap: 12,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardUnread: {
    borderWidth: 1,
    borderColor: colors.primaryTint,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontFamily: fonts.text.bold,
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  cardBody: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  cardTime: {
    fontFamily: fonts.text.regular,
    fontSize: 10,
    color: colors.textPlaceholder,
    marginTop: 6,
  },

  emptySection: {
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
