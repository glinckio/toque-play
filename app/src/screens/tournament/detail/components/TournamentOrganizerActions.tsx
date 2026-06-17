import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import ChevronButton from '../../../../components/ChevronButton';

interface Props {
  canPublish: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onPublish: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TournamentOrganizerActions({
  canPublish,
  canEdit,
  canDelete,
  onPublish,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View style={styles.actionsSection}>
      {canPublish && (
        <ChevronButton
          variant="primary"
          size="lg"
          fullWidth
          onPress={onPublish}
          icon={<Ionicons name="rocket-outline" size={16} color="#FFFFFF" />}
        >
          PUBLICAR
        </ChevronButton>
      )}
      {canEdit && (
        <ChevronButton
          variant="ghost"
          size="lg"
          fullWidth
          onPress={onEdit}
          icon={<Ionicons name="create-outline" size={16} color={colors.primary} />}
        >
          EDITAR
        </ChevronButton>
      )}
      {canDelete && (
        <ChevronButton
          variant="danger"
          size="lg"
          fullWidth
          onPress={onDelete}
          icon={<Ionicons name="trash-outline" size={16} color="#FFFFFF" />}
        >
          EXCLUIR TORNEIO
        </ChevronButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsSection: { gap: spacing.md, marginTop: spacing.xl },
});
