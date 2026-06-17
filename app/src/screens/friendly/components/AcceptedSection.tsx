import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import ChevronButton from '../../../components/ChevronButton';

interface Props {
  canWatchLive: boolean;
  matchId?: string;
  refereeCode?: string | null;
  canManageCode: boolean;
  codeLoading: boolean;
  onWatchLive: () => void;
  onGenerateCode: () => void;
  onEnterAsReferee: () => void;
}

export function AcceptedSection({
  canWatchLive,
  matchId,
  refereeCode,
  canManageCode,
  codeLoading,
  onWatchLive,
  onGenerateCode,
  onEnterAsReferee,
}: Props) {
  return (
    <View style={styles.acceptedSection}>
      {canWatchLive && matchId && (
        <ChevronButton
          variant="danger"
          size="lg"
          fullWidth
          onPress={onWatchLive}
          icon={<Ionicons name="eye" size={16} color="#FFFFFF" />}
        >
          ACOMPANHAR PARTIDA
        </ChevronButton>
      )}

      {canManageCode &&
        (refereeCode ? (
          <View style={styles.codeCard}>
            <Ionicons name="key-outline" size={24} color={colors.primary} />
            <Text style={styles.codeLabel}>CÓDIGO DE ACESSO</Text>
            <Text style={styles.codeValue}>{refereeCode}</Text>
            <Text style={styles.codeHint}>
              Compartilhe este código com o árbitro para que ele possa apitar a partida.
            </Text>
          </View>
        ) : (
          <ChevronButton
            variant="ghost"
            size="lg"
            fullWidth
            onPress={onGenerateCode}
            disabled={codeLoading}
            icon={<Ionicons name="key-outline" size={16} color={colors.primary} />}
          >
            {codeLoading ? 'GERANDO...' : 'GERAR CÓDIGO DE ACESSO'}
          </ChevronButton>
        ))}

      <ChevronButton
        variant="primary"
        size="lg"
        fullWidth
        onPress={onEnterAsReferee}
        icon={<Ionicons name="flag-outline" size={16} color="#FFFFFF" />}
      >
        ENTRAR COMO ÁRBITRO
      </ChevronButton>
    </View>
  );
}

const styles = StyleSheet.create({
  acceptedSection: { gap: spacing.md, marginBottom: spacing.xxl },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  codeLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.medium,
    color: colors.textMuted,
    marginTop: spacing.sm,
    letterSpacing: typography.letterSpacing.medium,
  },
  codeValue: {
    fontSize: typography.sizes.hero,
    fontFamily: fonts.title.regular,
    color: colors.primary,
    letterSpacing: 6,
  },
  codeHint: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});
