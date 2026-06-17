import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import ChevronButton from '../../../components/ChevronButton';

interface Props {
  canRespond: boolean;
  canCancel: boolean;
  loading: boolean;
  onAccept: () => void;
  onReject: () => void;
  onCancel: () => void;
}

export function ActionsFooter({
  canRespond,
  canCancel,
  loading,
  onAccept,
  onReject,
  onCancel,
}: Props) {
  if (!canRespond && !canCancel) return null;
  return (
    <View style={styles.actions}>
      {canRespond && (
        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }}>
            <ChevronButton
              variant="success"
              size="lg"
              fullWidth
              onPress={onAccept}
              disabled={loading}
            >
              ACEITAR
            </ChevronButton>
          </View>
          <View style={{ flex: 1 }}>
            <ChevronButton
              variant="danger"
              size="lg"
              fullWidth
              onPress={onReject}
              disabled={loading}
            >
              RECUSAR
            </ChevronButton>
          </View>
        </View>
      )}
      {canCancel && (
        <TouchableOpacity
          style={styles.cancelFullBtn}
          onPress={onCancel}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelFullText}>CANCELAR AMISTOSO</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { gap: spacing.md, marginTop: spacing.xl },
  actionsRow: { flexDirection: 'row', gap: spacing.md },
  cancelFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(224,69,69,0.08)',
  },
  cancelFullText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.error,
  },
});
