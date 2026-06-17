import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import type { Tournament } from '../../../../types/tournament';
import { FORMAT_LABELS, MODALITY_LABELS, TYPE_LABELS, formatBRL } from '../detail.constants';

interface Props {
  tournament: Tournament;
}

export function TournamentCategoriesTab({ tournament }: Props) {
  if (!tournament.categories || tournament.categories.length === 0) {
    return <Text style={styles.emptyText}>Sem categorias ainda.</Text>;
  }
  return (
    <View style={styles.gapMd}>
      {tournament.categories.map((cat: any) => (
        <View key={cat.id} style={styles.catCard}>
          <View style={styles.catHeader}>
            <View>
              <Text style={styles.catTitle}>
                {TYPE_LABELS[cat.type] ?? cat.type} · {FORMAT_LABELS[cat.format] ?? cat.format} ·{' '}
                {MODALITY_LABELS[cat.modality] ?? cat.modality}
              </Text>
              <Text style={styles.catMeta}>
                {cat.bracketType ? String(cat.bracketType).replace(/_/g, ' ') : ''}
              </Text>
            </View>
            <View style={styles.catRight}>
              <View style={styles.catRegBadge}>
                <Text style={styles.catRegText}>
                  {cat.registrationsCount ?? cat._count?.registrations ?? 0} insc.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.catDetails}>
            <Text style={styles.catDetailText}>Melhor de {cat.bestOfSets}</Text>
            <Text style={styles.catDetailText}>Tiebreak {cat.tiebreakScore}</Text>
            <Text
              style={[
                styles.catDetailText,
                cat.registrationPrice ?? cat.price ? {} : { color: colors.success },
              ]}
            >
              {formatBRL(cat.registrationPrice ?? cat.price)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gapMd: { gap: spacing.md },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textPlaceholder,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catTitle: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.text,
    letterSpacing: 0.4,
  },
  catMeta: {
    fontFamily: fonts.text.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  catRight: { alignItems: 'flex-end', gap: 4 },
  catRegBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  catRegText: {
    fontFamily: fonts.title.regular,
    fontSize: 12,
    color: colors.primary,
  },
  catDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  catDetailText: {
    fontFamily: fonts.text.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
});
