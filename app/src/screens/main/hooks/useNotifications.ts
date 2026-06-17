import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { notificationService } from '../../../services/notification';
import { teamService } from '../../../services/team';
import { friendlyService } from '../../../services/friendly';
import { useNotifStore } from '../../../stores/notifStore';
import { useDialogStore } from '../../../stores/dialogStore';
import type { AppNotification } from '../../../types/notification';
import type { TeamInvitation } from '../../../types/team';
import {
  FRIENDLY_TYPES,
  MATCH_TYPES,
  TOURNAMENT_TYPES,
  type DisplayItem,
} from '../notifications.constants';

export function useNotifications() {
  const dialog = useDialogStore();
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [notifs, invites] = await Promise.all([
        notificationService.findMine().catch(() => [] as AppNotification[]),
        teamService.findPendingInvitations().catch(() => [] as TeamInvitation[]),
      ]);

      const notifItems: DisplayItem[] = (notifs as AppNotification[])
        .filter((n) => n.type !== 'TEAM_INVITE')
        .map((n) => ({
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const decrementBadge = useCallback(() => {
    useNotifStore.getState().setUnreadCount(Math.max(0, useNotifStore.getState().unreadCount - 1));
  }, []);

  const handleAcceptInvite = useCallback(
    async (invitationId: string) => {
      setResponding(invitationId);
      try {
        await teamService.acceptInvitation(invitationId);
        setItems((prev) => prev.filter((i) => i.invitationId !== invitationId));
        decrementBadge();
      } catch {
        dialog.error('Não foi possível aceitar o convite');
      } finally {
        setResponding(null);
      }
    },
    [dialog, decrementBadge],
  );

  const handleRejectInvite = useCallback(
    async (invitationId: string) => {
      setResponding(invitationId);
      try {
        await teamService.rejectInvitation(invitationId);
        setItems((prev) => prev.filter((i) => i.invitationId !== invitationId));
        decrementBadge();
      } catch {
        dialog.error('Não foi possível recusar o convite');
      } finally {
        setResponding(null);
      }
    },
    [dialog, decrementBadge],
  );

  const handleAcceptFriendly = useCallback(
    async (item: DisplayItem) => {
      if (!item.referenceId) return;
      try {
        await notificationService.markAsRead(item.id);
      } catch {
        // noop
      }
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      decrementBadge();
      navigation.navigate('Friendly', {
        screen: 'FriendlyDetail',
        params: { friendlyId: item.referenceId },
      });
    },
    [navigation, decrementBadge],
  );

  const handleRejectFriendly = useCallback(
    async (item: DisplayItem) => {
      if (!item.referenceId) return;
      setResponding(item.referenceId);
      try {
        await friendlyService.reject(item.referenceId);
        try {
          await notificationService.markAsRead(item.id);
        } catch {
          // noop
        }
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        decrementBadge();
      } catch {
        dialog.error('Não foi possível recusar o amistoso');
      } finally {
        setResponding(null);
      }
    },
    [dialog, decrementBadge],
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setItems([]);
      useNotifStore.getState().setUnreadCount(0);
    } catch {
      // noop
    }
  }, []);

  const handleNotificationTap = useCallback(
    async (item: DisplayItem) => {
      if (item.id.startsWith('inv-')) return;

      try {
        await notificationService.markAsRead(item.id);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        decrementBadge();
      } catch {
        // noop
      }

      const ref = item.referenceId;
      if (!ref) return;

      if (FRIENDLY_TYPES.includes(item.type)) {
        navigation.navigate('Friendly', {
          screen: 'FriendlyDetail',
          params: { friendlyId: ref },
        });
      } else if (TOURNAMENT_TYPES.includes(item.type)) {
        navigation.navigate('Tournament', {
          screen: 'TournamentDetail',
          params: { tournamentId: ref },
        });
      } else if (MATCH_TYPES.includes(item.type)) {
        navigation.navigate('Tournament', {
          screen: 'LiveMatch',
          params: { matchId: ref },
        });
      }
    },
    [navigation, decrementBadge],
  );

  const unreadCount = items.filter((i) => !i.read).length;

  return {
    items,
    loading,
    refreshing,
    responding,
    unreadCount,
    onRefresh,
    handleAcceptInvite,
    handleRejectInvite,
    handleAcceptFriendly,
    handleRejectFriendly,
    handleMarkAllRead,
    handleNotificationTap,
  };
}
