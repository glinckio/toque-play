import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import ChevronButton from '../../../components/ChevronButton';

interface Props {
  isScheduled: boolean;
  isLive: boolean;
  actionLoading: boolean;
  teamAName: string;
  teamBName: string;
  onStart: () => void;
  onFinishSet: () => void;
  onFinish: () => void;
  onWalkover: (winner: 'A' | 'B') => void;
}

export function MatchRefereeControls({
  isScheduled,
  isLive,
  actionLoading,
  teamAName,
  teamBName,
  onStart,
  onFinishSet,
  onFinish,
  onWalkover,
}: Props) {
  return (
    <View style={styles.controlsCard}>
      <Text style={styles.controlsTitle}>CONTROLES DO ÁRBITRO</Text>

      {isScheduled && (
        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={onStart}
          disabled={actionLoading}
          icon={<Ionicons name="play" size={16} color="#FFFFFF" />}
        >
          {actionLoading ? 'INICIANDO...' : 'INICIAR PARTIDA'}
        </ChevronButton>
      )}

      {isLive && (
        <>
          <View style={styles.actionChips}>
            <TouchableOpacity style={styles.actionChip} activeOpacity={0.7}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.actionChipText}>Timeout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionChip} activeOpacity={0.7}>
              <Ionicons name="swap-horizontal-outline" size={18} color={colors.primary} />
              <Text style={styles.actionChipText}>Subst.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionChip}
              onPress={() => {
                Alert.alert('W.O.', 'Qual time vence por W.O.?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: teamAName, onPress: () => onWalkover('A') },
                  { text: teamBName, onPress: () => onWalkover('B') },
                ]);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trophy-outline" size={18} color={colors.primary} />
              <Text style={styles.actionChipText}>W.O.</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.finishRow}>
            <ChevronButton
              variant="primary"
              size="lg"
              fullWidth
              onPress={onFinishSet}
              icon={<Ionicons name="checkmark-done" size={16} color="#FFFFFF" />}
            >
              ENCERRAR SET
            </ChevronButton>
          </View>
          <TouchableOpacity style={styles.finishMatchBtn} onPress={onFinish} activeOpacity={0.7}>
            <Ionicons name="stop-circle-outline" size={18} color={colors.textMuted} />
            <Text style={styles.finishMatchText}>FINALIZAR PARTIDA</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controlsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    padding: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.lg,
  },
  controlsTitle: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
  },
  actionChips: { flexDirection: 'row', gap: spacing.md },
  actionChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.15)',
    paddingVertical: spacing.md,
  },
  actionChipText: {
    fontSize: 11,
    fontFamily: fonts.text.medium,
    color: colors.primary,
  },
  finishRow: { marginBottom: spacing.sm },
  finishMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  finishMatchText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
