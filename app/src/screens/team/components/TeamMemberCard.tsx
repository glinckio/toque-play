import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import { POSITION_LABELS } from '../../../types/team';
import type { TeamMember } from '../../../types/team';
import { memberName } from '../utils';
import { CaptainBadge, GuestBadge, PositionBadge } from './Badges';

interface Props {
  member: TeamMember;
  isOwner: boolean;
  onInfo: (member: TeamMember) => void;
  onEdit: (member: TeamMember) => void;
  onToggleCaptain: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

export function TeamMemberCard({
  member,
  isOwner,
  onInfo,
  onEdit,
  onToggleCaptain,
  onRemove,
}: Props) {
  return (
    <View style={styles.memberCard}>
      <View style={[styles.memberAvatar, member.isCaptain && styles.memberAvatarCaptain]}>
        <Text style={[styles.memberAvatarLetter, member.isCaptain && styles.memberAvatarLetterCaptain]}>
          {memberName(member).charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <View style={styles.memberNameRow}>
          <Text style={styles.memberName} numberOfLines={1}>{memberName(member)}</Text>
          {member.isCaptain && <CaptainBadge />}
          {member.isGuest && <GuestBadge />}
        </View>
        {member.positions?.length > 0 && (
          <View style={styles.positionsRow}>
            {member.positions.map((p) => (
              <PositionBadge key={p} label={POSITION_LABELS[p]} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.memberActions}>
        <TouchableOpacity
          onPress={() => onInfo(member)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="information-circle-outline" size={18} color={colors.textPlaceholder} />
        </TouchableOpacity>
        {isOwner && (
          <>
            <TouchableOpacity
              onPress={() => onEdit(member)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="create-outline" size={18} color={colors.textPlaceholder} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onToggleCaptain(member)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={member.isCaptain ? 'ribbon' : 'ribbon-outline'}
                size={18}
                color={member.isCaptain ? colors.primary : colors.textPlaceholder}
              />
            </TouchableOpacity>
            {!member.isCaptain && (
              <TouchableOpacity
                onPress={() => onRemove(member)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle-outline" size={18} color={colors.error} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarCaptain: { backgroundColor: '#FFF3CD' },
  memberAvatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.primary,
    lineHeight: 1,
  },
  memberAvatarLetterCaptain: { color: '#B8860B' },
  memberInfo: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  memberName: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.text,
  },
  positionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  memberActions: { flexDirection: 'row', gap: spacing.sm },
});
