import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import type { Friendly } from '../../../types/friendly';
import { formatDate, formatTime } from '../constants';

interface Props {
  friendly: Friendly;
}

export function FriendlyInfoCard({ friendly }: Props) {
  const time = formatTime(friendly.startTime);
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
        <Text style={styles.infoText}>
          {formatDate(friendly.date)}
          {time ? ` às ${time}` : ''}
        </Text>
      </View>
      {friendly.address && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>
            {friendly.address}
            {friendly.city ? `, ${friendly.city}` : ''}
            {friendly.state ? ` - ${friendly.state}` : ''}
          </Text>
        </View>
      )}
      {(friendly.modality || friendly.categoryFormat) && (
        <View style={styles.infoRow}>
          <Ionicons
            name={friendly.modality === 'BEACH' ? 'sunny-outline' : 'fitness-outline'}
            size={18}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            {friendly.modality === 'BEACH'
              ? 'Areia'
              : friendly.modality === 'COURT'
                ? 'Quadra'
                : ''}
            {friendly.modality && friendly.categoryFormat ? ' · ' : ''}
            {friendly.categoryFormat === 'PAIR'
              ? 'Dupla'
              : friendly.categoryFormat === 'QUARTET'
                ? 'Quarteto'
                : friendly.categoryFormat === 'SEXTET'
                  ? 'Sexteto'
                  : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoText: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.regular,
    color: colors.text,
    flex: 1,
  },
});
