import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';

interface Props {
  onPress: () => void;
}

export function TeamDeleteButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.deleteBtn} activeOpacity={0.7}>
      <Ionicons name="trash-outline" size={18} color={colors.error} />
      <Text style={styles.deleteBtnText}>Excluir equipe</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(224,69,69,0.08)',
  },
  deleteBtnText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.error,
  },
});
