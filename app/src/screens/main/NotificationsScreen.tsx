import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { useNotifications } from './hooks/useNotifications';
import { NotificationHeader } from './components/NotificationHeader';
import { NotificationCard } from './components/NotificationCard';
import { NotificationEmptyState } from './components/NotificationEmptyState';
import { groupByDay } from './notifications.constants';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const {
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
  } = useNotifications();

  const groups = groupByDay(items);

  if (loading) {
    return (
      <View style={styles.root}>
        <View style={{ height: insets.top }} />
        <NotificationHeader
          unreadCount={unreadCount}
          loading={loading}
          onMarkAllRead={handleMarkAllRead}
        />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={{ height: insets.top }} />
      <NotificationHeader
        unreadCount={unreadCount}
        loading={loading}
        onMarkAllRead={handleMarkAllRead}
      />

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
                {dayItems.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    responding={responding}
                    onPress={handleNotificationTap}
                    onAcceptFriendly={handleAcceptFriendly}
                    onRejectFriendly={handleRejectFriendly}
                    onAcceptInvite={handleAcceptInvite}
                    onRejectInvite={handleRejectInvite}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <NotificationEmptyState />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
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
});
