import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';

interface CreateSheetProps {
  visible: boolean;
  onClose: () => void;
  onTournament: () => void;
  onTeam: () => void;
  onFriendly: () => void;
}

export default function CreateSheet({ visible, onClose, onTournament, onTeam, onFriendly }: CreateSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>CRIAR</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>O que vamos organizar agora?</Text>

          {/* Options */}
          <View style={styles.grid}>
            {/* Torneio */}
            <TouchableOpacity
              style={styles.optionTournament}
              onPress={onTournament}
              activeOpacity={0.8}
            >
              <Ionicons name="trophy" size={28} color="#FFFFFF" />
              <Text style={styles.optionTitleWhite}>TORNEIO</Text>
              <Text style={styles.optionDescWhite}>Crie um circuito ou copa</Text>
            </TouchableOpacity>

            {/* Time */}
            <TouchableOpacity
              style={styles.optionTeam}
              onPress={onTeam}
              activeOpacity={0.8}
            >
              <Ionicons name="shield" size={28} color={colors.primary} />
              <Text style={styles.optionTitlePurple}>TIME</Text>
              <Text style={styles.optionDesc}>Monte sua equipe</Text>
            </TouchableOpacity>

            {/* Amistoso */}
            <TouchableOpacity
              style={styles.optionFriendly}
              onPress={onFriendly}
              activeOpacity={0.8}
            >
              <Ionicons name="volleyball" size={28} color={colors.primary} />
              <Text style={styles.optionTitlePurple}>AMISTOSO</Text>
              <Text style={styles.optionDesc}>Desafie outro time</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(21, 10, 31, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.section,
    borderTopRightRadius: radius.section,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: 22,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.xl,
  },
  grid: {
    gap: spacing.md,
  },
  optionTournament: {
    backgroundColor: colors.primary,
    borderRadius: radius.card,
    padding: spacing.xl,
  },
  optionTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  optionFriendly: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  optionTitleWhite: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: typography.letterSpacing.medium,
    marginTop: spacing.md,
  },
  optionTitlePurple: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
  },
  optionDescWhite: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  optionDesc: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
});
