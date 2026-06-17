import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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
  member: TeamMember | null;
  onClose: () => void;
}

export function AthleteInfoModal({ member, onClose }: Props) {
  return (
    <Modal
      visible={!!member}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.infoOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.infoCard}>
          {member && (
            <>
              <View style={styles.infoHeader}>
                <View style={styles.infoAvatar}>
                  <Text style={styles.infoAvatarLetter}>
                    {memberName(member).charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.infoHeaderInfo}>
                  <Text style={styles.infoName}>{memberName(member)}</Text>
                  <View style={styles.infoBadges}>
                    {member.isCaptain && <CaptainBadge />}
                    {member.isGuest && <GuestBadge label="CONVIDADO" />}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {member.positions?.length > 0 ? (
                <View style={styles.infoPositions}>
                  {member.positions.map((p) => (
                    <PositionBadge key={p} label={POSITION_LABELS[p]} />
                  ))}
                </View>
              ) : null}

              {!member.isGuest && member.user ? (
                <View style={styles.infoContact}>
                  <View style={styles.infoContactRow}>
                    <Ionicons name="mail-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoContactText}>{member.user.email}</Text>
                  </View>
                  <View style={styles.infoContactRow}>
                    <Ionicons name="call-outline" size={16} color={colors.textMuted} />
                    <Text style={styles.infoContactText}>
                      {member.user.phone ? member.user.phone : 'Telefone não informado'}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.infoGuestNote}>Convidado sem contato vinculado.</Text>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  infoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,30,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoAvatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: 22,
    color: colors.primary,
    lineHeight: 1,
  },
  infoHeaderInfo: { flex: 1 },
  infoName: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.button,
    color: colors.text,
  },
  infoBadges: { flexDirection: 'row', gap: 4, marginTop: 4 },
  infoPositions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: spacing.md,
  },
  infoContact: { marginTop: spacing.lg, gap: spacing.sm },
  infoContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoContactText: {
    flex: 1,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  infoGuestNote: {
    marginTop: spacing.md,
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
