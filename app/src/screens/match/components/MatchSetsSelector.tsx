import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import type { Match } from '../../../types/match';

interface Props {
  sets: NonNullable<Match['sets']>;
  isLive: boolean;
  currentSetNum: number;
  selectedSet: number | null;
  onSelect: (setNumber: number) => void;
}

export function MatchSetsSelector({
  sets,
  isLive,
  currentSetNum,
  selectedSet,
  onSelect,
}: Props) {
  return (
    <View style={styles.setsCard}>
      <Text style={styles.setsCardTitle}>SETS</Text>
      <View style={styles.setsChips}>
        {sets.map((set) => {
          const isActive = isLive && set.setNumber === currentSetNum;
          const isSelected = selectedSet === set.setNumber;
          const isSetFinished = set.scoreA !== set.scoreB;
          return (
            <TouchableOpacity
              key={set.id}
              style={[
                styles.setChip,
                isActive && styles.setChipLive,
                isSelected && !isActive && styles.setChipSelected,
                isSetFinished && !isActive && styles.setChipFinished,
              ]}
              onPress={() => onSelect(set.setNumber)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.setChipText,
                  isActive && styles.setChipTextLive,
                  isSelected && !isActive && styles.setChipTextSelected,
                  isSetFinished && !isActive && styles.setChipTextActive,
                ]}
              >
                {set.setNumber}: {set.scoreA}–{set.scoreB}
              </Text>
              {isActive && <View style={styles.liveChipDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  setsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  setsCardTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  setsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  setChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryTint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setChipLive: {
    backgroundColor: 'rgba(224,69,69,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(224,69,69,0.3)',
  },
  setChipSelected: {
    backgroundColor: 'rgba(109,46,192,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(109,46,192,0.3)',
  },
  setChipFinished: { backgroundColor: colors.primary },
  setChipText: {
    fontFamily: fonts.title.regular,
    fontSize: 13,
    color: colors.text,
    letterSpacing: 0.5,
  },
  setChipTextLive: { color: '#C0392B' },
  setChipTextSelected: { color: colors.primary },
  setChipTextActive: { color: '#FFFFFF' },
  liveChipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E04545' },
});
