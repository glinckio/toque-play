import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import ChevronButton from '../../../../components/ChevronButton';

interface Props {
  step: number;
  isEditing: boolean;
  saving: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function TournamentFormBottomBar({
  step,
  isEditing,
  saving,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
}: Props) {
  if (step < 3) {
    return (
      <View style={styles.bottomBar}>
        <View style={styles.navRow}>
          {step > 0 ? (
            <ChevronButton variant="ghost" size="md" onPress={onBack}>
              VOLTAR
            </ChevronButton>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <ChevronButton
            variant="primary"
            size="md"
            onPress={onNext}
            icon={<Ionicons name="arrow-forward" size={14} color="#FFFFFF" />}
          >
            PRÓXIMO
          </ChevronButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bottomBar}>
      <View style={styles.publishRow}>
        <ChevronButton variant="ghost" size="md" onPress={onBack}>
          VOLTAR
        </ChevronButton>
        {!isEditing && (
          <ChevronButton
            variant="secondary"
            size="md"
            onPress={onSaveDraft}
            disabled={saving}
          >
            {saving ? 'SALVANDO...' : 'RASCUNHO'}
          </ChevronButton>
        )}
        <ChevronButton
          variant="primary"
          size="md"
          onPress={onPublish}
          disabled={saving}
          icon={<Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        >
          {saving ? 'SALVANDO...' : isEditing ? 'SALVAR' : 'PUBLICAR'}
        </ChevronButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  publishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
