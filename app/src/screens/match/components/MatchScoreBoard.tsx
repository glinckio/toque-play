import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';

interface Props {
  scoreA: number;
  scoreB: number;
  onPoint: (team: 'A' | 'B') => void;
  onRemovePoint: (team: 'A' | 'B') => void;
}

export function MatchScoreBoard({ scoreA, scoreB, onPoint, onRemovePoint }: Props) {
  return (
    <View style={styles.scoreBoxes}>
      <ScoreBox
        score={scoreA}
        onPoint={() => onPoint('A')}
        onRemovePoint={() => onRemovePoint('A')}
      />
      <ScoreBox
        score={scoreB}
        onPoint={() => onPoint('B')}
        onRemovePoint={() => onRemovePoint('B')}
      />
    </View>
  );
}

function ScoreBox({
  score,
  onPoint,
  onRemovePoint,
}: {
  score: number;
  onPoint: () => void;
  onRemovePoint: () => void;
}) {
  return (
    <View style={styles.scoreBox}>
      <TouchableOpacity style={styles.scoreTapArea} onPress={onPoint} activeOpacity={0.7}>
        <Text style={styles.scoreValue}>{score}</Text>
      </TouchableOpacity>
      <View style={styles.scoreBtnRow}>
        <TouchableOpacity style={styles.minusBtn} onPress={onRemovePoint} activeOpacity={0.7}>
          <Ionicons name="remove" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.scoreBtnDivider} />
        <TouchableOpacity style={styles.plusBtn} onPress={onPoint} activeOpacity={0.7}>
          <Ionicons name="add" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreBoxes: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  scoreBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#EDEDF0',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreTapArea: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: fonts.title.regular,
    fontSize: 72,
    color: colors.text,
    lineHeight: 80,
    letterSpacing: 2,
  },
  scoreBtnRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EDEDF0',
  },
  minusBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBtnDivider: { width: 1, backgroundColor: '#EDEDF0' },
});
