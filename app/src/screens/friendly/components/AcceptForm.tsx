import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import ChevronButton from '../../../components/ChevronButton';

interface Props {
  members: any[];
  selected: Set<string>;
  captainId: string | null;
  loading: boolean;
  max: number;
  submitting: boolean;
  onToggle: (memberId: string) => void;
  onSetCaptain: (memberId: string | null) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AcceptForm({
  members,
  selected,
  captainId,
  loading,
  max,
  submitting,
  onToggle,
  onSetCaptain,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <View style={styles.acceptFormCard}>
      <Text style={styles.acceptFormTitle}>SELECIONE SEUS JOGADORES ({selected.size}/{max})</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} size="small" style={{ marginVertical: spacing.md }} />
      ) : (
        members.map((member: any) => {
          const isSelected = selected.has(member.id);
          const isCap = captainId === member.id;
          const name = member.user?.name ?? member.guestName ?? '?';
          return (
            <View key={member.id} style={[styles.athleteCard, isSelected && styles.athleteCardActive]}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => onToggle(member.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                  {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <View style={styles.athleteInfo}>
                  <Text style={[styles.athleteName, isSelected && styles.athleteNameActive]} numberOfLines={1}>
                    {name}
                  </Text>
                  {member.isCaptain && <Text style={styles.capBadge}>CAP</Text>}
                  {member.isGuest && <Text style={styles.guestBadge}>CONVIDADO</Text>}
                </View>
              </TouchableOpacity>
              {isSelected && (
                <TouchableOpacity
                  onPress={() => onSetCaptain(isCap ? null : member.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isCap ? 'star' : 'star-outline'}
                    size={18}
                    color={isCap ? '#FFD700' : colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}
      <View style={styles.acceptFormActions}>
        <TouchableOpacity style={styles.cancelActionBtn} onPress={onCancel} activeOpacity={0.8}>
          <Text style={styles.cancelActionText}>CANCELAR</Text>
        </TouchableOpacity>
        <ChevronButton
          variant="primary"
          size="md"
          onPress={onConfirm}
          disabled={submitting || selected.size === 0}
        >
          {submitting ? 'CONFIRMANDO...' : 'CONFIRMAR'}
        </ChevronButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptFormCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  acceptFormTitle: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: typography.letterSpacing.medium,
  },
  athleteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  athleteCardActive: { backgroundColor: colors.primaryTint, borderColor: colors.primary },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textPlaceholder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  athleteInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  athleteName: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
  },
  athleteNameActive: { color: colors.primary },
  capBadge: {
    fontSize: 11,
    fontFamily: fonts.text.bold,
    color: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 1,
  },
  guestBadge: {
    fontSize: 11,
    fontFamily: fonts.text.bold,
    color: colors.textMuted,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 1,
  },
  acceptFormActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelActionBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  cancelActionText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
});
