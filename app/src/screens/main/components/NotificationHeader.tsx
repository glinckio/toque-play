import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';

interface Props {
  unreadCount: number;
  loading: boolean;
  onMarkAllRead: () => void;
}

export function NotificationHeader({ unreadCount, loading, onMarkAllRead }: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.pageTitle}>NOTIFICAÇÕES</Text>
        <Text style={styles.pageSub}>
          {loading ? 'Carregando...' : `${unreadCount} não lidas`}
        </Text>
      </View>
      {unreadCount > 0 && (
        <TouchableOpacity onPress={onMarkAllRead}>
          <Text style={styles.markAllBtn}>Marcar todas</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
