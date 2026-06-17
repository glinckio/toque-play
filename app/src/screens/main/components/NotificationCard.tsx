import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import ChevronButton from '../../../components/ChevronButton';
import { ICON_BG_MAP, ICON_MAP, type DisplayItem } from '../notifications.constants';

interface Props {
  item: DisplayItem;
  responding: string | null;
  onPress: (item: DisplayItem) => void;
  onAcceptFriendly: (item: DisplayItem) => void;
  onRejectFriendly: (item: DisplayItem) => void;
  onAcceptInvite: (invitationId: string) => void;
  onRejectInvite: (invitationId: string) => void;
}

export function NotificationCard({
  item,
  responding,
  onPress,
  onAcceptFriendly,
  onRejectFriendly,
  onAcceptInvite,
  onRejectInvite,
}: Props) {
  const icon = ICON_MAP[item.type] ?? 'notifications-outline';
  const iconBg = ICON_BG_MAP[item.type] ?? [colors.primary, colors.primaryLight];

  return (
    <TouchableOpacity
      style={[styles.card, !item.read && styles.cardUnread]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg[0] }]}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color="#FFFFFF" />
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
              onPress={() => onAcceptFriendly(item)}
              disabled={!!responding && responding === item.referenceId}
            >
              Aceitar
            </ChevronButton>
            <ChevronButton
              variant="ghost"
              size="sm"
              onPress={() => onRejectFriendly(item)}
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
                if (item.invitationId) onAcceptInvite(item.invitationId);
              }}
              disabled={!!responding && responding === item.invitationId}
            >
              Aceitar
            </ChevronButton>
            <ChevronButton
              variant="ghost"
              size="sm"
              onPress={() => {
                if (item.invitationId) onRejectInvite(item.invitationId);
              }}
              disabled={!!responding && responding === item.invitationId}
            >
              Recusar
            </ChevronButton>
          </View>
        )}

        <Text style={styles.cardTime}>
          {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 11,
    color: colors.textPlaceholder,
    marginTop: 6,
  },
});


