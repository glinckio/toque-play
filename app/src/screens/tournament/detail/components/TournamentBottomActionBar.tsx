import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import ChevronButton from '../../../../components/ChevronButton';

interface Props {
  insetsBottom: number;
  alreadyRegistered: boolean;
  canRegister: boolean;
  canStart: boolean;
  canViewBrackets: boolean;
  onRegister: () => void;
  onStart: () => void;
  onViewBrackets: () => void;
}

export function TournamentBottomActionBar({
  insetsBottom,
  alreadyRegistered,
  canRegister,
  canStart,
  canViewBrackets,
  onRegister,
  onStart,
  onViewBrackets,
}: Props) {
  return (
    <View style={[styles.fixedBottom, { paddingBottom: Math.max(insetsBottom, 12) }]}>
      {alreadyRegistered && !canRegister && (
        <View style={styles.registeredBadge}>
          <View style={styles.registeredDot}>
            <Text style={styles.registeredDotText}>✓</Text>
          </View>
          <Text style={styles.registeredTitle}>VOCÊ ESTÁ INSCRITO</Text>
        </View>
      )}
      {canRegister && (
        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={onRegister}
          icon={<Ionicons name="person-add-outline" size={16} color="#FFFFFF" />}
        >
          INSCREVER MEU TIME
        </ChevronButton>
      )}
      {canStart && (
        <View style={styles.startRow}>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={onStart}
            icon={<Ionicons name="play" size={16} color="#FFFFFF" />}
          >
            INICIAR TORNEIO
          </ChevronButton>
          <ChevronButton
            variant="ghost"
            size="lg"
            fullWidth
            onPress={onViewBrackets}
            icon={<Ionicons name="git-branch-outline" size={16} color={colors.primary} />}
          >
            VER CHAVES
          </ChevronButton>
        </View>
      )}
      {canViewBrackets && !canStart && !canRegister && (
        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={onViewBrackets}
          icon={<Ionicons name="git-branch-outline" size={16} color="#FFFFFF" />}
        >
          ACOMPANHAR PARTIDAS
        </ChevronButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#ECECF0',
  },
  registeredBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(31,184,122,0.1)',
    borderRadius: 9999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  registeredDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registeredDotText: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: '#FFFFFF',
  },
  registeredTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 14,
    color: '#0E7A4A',
    letterSpacing: 0.5,
  },
  startRow: { gap: spacing.md },
});
